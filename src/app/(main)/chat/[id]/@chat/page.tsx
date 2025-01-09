"use client";
import { Bubble, useXAgent, useXChat } from "@ant-design/x";
import { createStyles } from "antd-style";
import React, { useEffect, useState } from "react";

import { Card, message, type GetProp } from "antd";
import { useChatContext } from "../layout";
import { openaiApi } from "@/lib/api/openai";
import { CustomSender } from "@/components/sender";
import { useSender } from "@/hooks/use-sender";
import { useGetDiagram } from "@/hooks/use-diagrams";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { diagramsApi, DiagramVersion } from "@/lib/api/diagrams";
import { MessageInfo, MessageStatus } from "@ant-design/x/es/useXChat";
import { Avatar as AvatarUser } from "@/components/avatar";
import { LocalIcons } from "@/components/local-icons";
import { useAppStore } from "@/store/app";
import { User } from "@/types/auth";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDiagramsStore } from "@/store/diagrams";
import { queryClient } from "@/lib/request";

const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      min-width: 1000px;
      // height: 722px;
      height: 100%;
      border-radius: ${token.borderRadius}px;
      display: flex;
      background: ${token.colorBgContainer};
      // font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

      .ant-prompts {
        color: ${token.colorText};
      }
    `,
    menu: css`
      background: ${token.colorBgLayout}80;
      width: 280px;
      height: 100%;
      display: flex;
      flex-direction: column;
    `,
    conversations: css`
      padding: 0 12px;
      flex: 1;
      overflow-y: auto;
    `,
    chat: css`
      // height: 100%;
      flex: 1;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: ${token.paddingLG}px;
      gap: 16px;
      justify-content: space-between;
      min-height: 0;
    `,
    messages: css`
      flex: 1;
      shrink: 1;
      min-height: 0;
    `,
    placeholder: css`
      padding-top: 32px;
    `,
    sender: css`
      box-shadow: ${token.boxShadow};
    `,
    logo: css`
      display: flex;
      height: 72px;
      align-items: center;
      justify-content: start;
      padding: 0 24px;
      box-sizing: border-box;

      img {
        width: 24px;
        height: 24px;
        display: inline-block;
      }

      span {
        display: inline-block;
        margin: 0 8px;
        font-weight: bold;
        color: ${token.colorText};
        font-size: 16px;
      }
    `,
    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      width: calc(100% - 24px);
      margin: 0 12px 24px 12px;
    `,
    loadingDots: css`
      display: inline-block;
      &::after {
        content: "...";
        animation: dots 1.5s steps(4, end) infinite;
        display: inline-block;
        width: 0;
        overflow: hidden;
        white-space: nowrap;
      }

      @keyframes dots {
        to {
          width: 1.25em;
        }
      }
    `,
  };
});

const roles: (user: User) => GetProp<typeof Bubble.List, "roles"> = (
  user: User
) => ({
  ai: {
    placement: "start",
    // typing: { step: 5, interval: 20 },
    avatar: {
      icon: <LocalIcons.SystemLogo className="w-4 h-4" />,
    },
    styles: {
      content: {
        borderRadius: 16,
      },
    },
  },
  local: {
    placement: "start",
    variant: "shadow",
    avatar: {
      icon: <AvatarUser name={user?.username} />,
    },
  },
});

const Independent: React.FC = () => {
  const { user } = useAppStore();

  const router = useRouter();

  const searchParams = useSearchParams();
  // const
  const { id } = useParams();
  // console.log("leilei", params);
  const { data: diagramsData } = useGetDiagram(id as string);
  // 在需要使用数据的地方进行条件判断
  const diagrams = id !== "new" ? diagramsData : null;

  // ==================== Style ====================
  const { styles } = useStyle();

  // ==================== State ====================

  // ==================== Runtime ====================

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onUpdate, onSuccess }) => {
      console.log("message", message);
      await generateMermaidCode(message as string, onUpdate, onSuccess);
    },
  });

  const { onRequest, messages, setMessages } = useXChat({
    agent,
  });
  console.log("messages", messages);

  const { setShowRightPanel } = useChatContext();
  // ==================== Event ====================
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return;
    setShowRightPanel(true);
    onRequest(nextContent);
    setContent("");
  };

  const queryProjectId = searchParams.get("pid");
  const queryDescription = searchParams.get("d");
  console.log("queryDescription", queryDescription);
  console.log("queryProjectId", queryProjectId);

  // 处理刚创建的情况
  useEffect(() => {
    const init = async () => {
      if (queryDescription && queryProjectId) {
        console.log("queryDescription", queryDescription);
        console.log("queryProjectId", queryProjectId);
        // setMessages([]);
        const messages: MessageInfo<string>[] = [];
        messages.push({
          id: `local-${Date.now()}-${queryProjectId}`,
          message: queryDescription,
          status: "local",
        });
        messages.push({
          id: `ai-${Date.now()}-${queryProjectId}`,
          message: JSON.stringify({
            diagramId: "new",
            mermaidCode: "",
          }),
          status: "success",
        });
        setMessages(messages);

        const response = await diagramsApi.createDiagram({
          projectId: queryProjectId as string,
          description: queryDescription as string,
        });

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader available");
        let fullResponse = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // 解析 SSE 格式数据
          const text = new TextDecoder().decode(value);
          const lines = text.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const jsonData = JSON.parse(line.slice(6));
                if (jsonData.content) {
                  fullResponse += jsonData.content;
                  // 实时更新UI
                  // setContent(fullResponse);
                  console.log("setMermaidCode", fullResponse);
                  setMermaidCode(fullResponse);
                  setMessages((prev) => {
                    const prevMessages = [...prev];

                    // todo
                    prevMessages[prevMessages.length - 1].message =
                      JSON.stringify({
                        diagramId: jsonData.diagram.id,
                        mermaidCode: fullResponse,
                      });
                    // fullResponse;

                    return prevMessages;
                  });
                }
                if (jsonData.diagram) {
                  console.log("jsonData.diagram", jsonData.diagram);
                  router.replace(`/chat/${jsonData.diagram.id}`);
                }
              } catch (e) {
                // 忽略非JSON格式的行
                continue;
              }
            }
          }
        }
        console.log("init res", fullResponse);
      }
    };

    init();
  }, [queryDescription, queryProjectId]);

  useEffect(() => {
    const messages: MessageInfo<string>[] = [];
    diagrams?.versions.forEach((version, index) => {
      messages.push({
        id: `local-${Date.now()}-${version.id}`,
        message: version.description || diagrams.description,
        status: "local",
      });
      messages.push({
        id: `ai-${Date.now()}-${version.id}`,
        // message: version.mermaidCode,
        message: JSON.stringify({
          diagramId: version.id,
          mermaidCode: version.mermaidCode,
        }),
        status: "success",
      });
      if (index === diagrams?.versions.length - 1) {
        setMermaidCode(version.mermaidCode);
        setIsShowDiagram(version);
      }
    });
    if (diagrams?.id) {
      setMessages(messages);
    }
  }, [diagrams?.id]);

  // ==================== Nodes ====================
  const [isShowDiagram, setIsShowDiagram] = useState<DiagramVersion | null>(
    null
  );
  const messageRender = (message: string, status: MessageStatus) => {
    if (status !== "local") {
      try {
        const { diagramId, mermaidCode } = JSON.parse(message);
        return (
          <div style={{ marginBottom: 12 }}>
            <Card
              onClick={() => {
                setIsShowDiagram(
                  diagrams?.versions.find((one) => one.id === diagramId) || null
                );
              }}
              hoverable
              className="hover:shadow-md"
              style={{
                outline:
                  isShowDiagram?.id === diagramId ? "1px solid #1677ff" : "",
              }}
            >
              {/* {mermaidCode} */}
              <span className="text-sm text-gray-500">
                {diagramId === "new" ? (
                  <div className="flex items-center">
                    Generating diagram
                    <div style={{ width: "2em" }}>
                      <span className={styles.loadingDots}></span>
                    </div>
                  </div>
                ) : (
                  "Generated diagram"
                )}
              </span>
            </Card>
          </div>
        );
      } catch (e) {
        return <div>{message}</div>;
      }
    }
    return message;
  };
  const items: GetProp<typeof Bubble.List, "items"> = messages.map(
    ({ id, message, status }) => ({
      key: id,
      // loading: status === "loading",
      role: status === "local" ? "local" : "ai",
      content: messageRender(message, status),
      variant: "borderless",
    })
  );

  const [isLoading, setIsLoading] = useState(false);
  // 第二步：生成 Mermaid DSL
  const generateMermaidCode = async (
    description: string,
    onUpdate: (mermaidCode: string) => void,
    onSuccess: (mermaidCode: string) => void
  ) => {
    try {
      setIsLoading(true);
      const response = await diagramsApi.createDiagramVersion(id as string, {
        comment: description,
      });
      // const response = await openaiApi.mermaidStream({ description });
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();

        // 解析sse数据
        // 解析 SSE 格式数据
        const text = new TextDecoder().decode(value);
        const lines = text.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const jsonData = JSON.parse(line.slice(6));
              if (jsonData.content) {
                fullResponse += jsonData.content;
                // 实时更新UI
                setMermaidCode(fullResponse);
                // onUpdate(fullResponse);
                onUpdate(
                  JSON.stringify({
                    diagramId: "new",
                    mermaidCode: fullResponse,
                  })
                );
              }
              // todo 在流式数据的末尾拿到这次的version的id 但是目前拿不到

              if (jsonData.version) {
                // onSuccess(jsonData.version.mermaidCode);
                setIsShowDiagram(jsonData.version);
                message.success("生成成功");

                onSuccess(
                  JSON.stringify({
                    diagramId: jsonData.version.id,
                    mermaidCode: jsonData.version.mermaidCode,
                  })
                );
                setMessages((prev) => {
                  const prevMessages = [...prev];

                  // todo
                  prevMessages[prevMessages.length - 1].message =
                    JSON.stringify({
                      diagramId: jsonData.diagram.id,
                      mermaidCode: jsonData.version.mermaidCode,
                    });

                  // fullResponse;

                  return prevMessages;
                });
                await queryClient.invalidateQueries({
                  queryKey: ["diagram", id],
                  exact: true,
                  refetchType: "all",
                });
              }
            } catch (e) {
              // 忽略非JSON格式的行
              continue;
            }
          }
        }
        if (done) {
          // window.location.reload();
          // router.replace(`/chat/${id}`, { forceRefresh: true });
          // router.refresh();
          // queryClient.invalidateQueries({ queryKey: ["diagram", id] });

          break;
        }
      }
    } catch (error) {
      console.error("生成 Mermaid 代码失败:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const { setMermaidCode, setEnhancedDescription } = useChatContext();

  const { content, setContent, loading, setLoading, enhanceDescription } =
    useSender();

  const { setRenameDiagramDialogOpen } = useDiagramsStore();
  const handleRenameDiagram = () => {
    setRenameDiagramDialogOpen(true, diagrams);
  };

  // useEffect(() => {
  //   // debugger;
  //   setMermaidCode(isShowDiagram?.mermaidCode || "");
  // }, [isShowDiagram?.id]);
  // ==================== Render =================
  return (
    <>
      {diagrams && (
        <header className="px-4 flex justify-between items-center h-12">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/chat/projects`}>Projects</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/chat/projects/${diagrams?.projectId}`}>
                    {diagrams?.project?.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <BreadcrumbPage
                      onClick={handleRenameDiagram}
                      className="hover:underline"
                      style={{ cursor: "pointer" }}
                    >
                      {diagrams?.title}
                    </BreadcrumbPage>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Rename Diagram</p>
                  </TooltipContent>
                </Tooltip>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
      )}
      <div className={styles.chat}>
        {/* <div
          className="flex-1 contain-strict overflow-auto"
          style={{ minHeight: 0 }}
        > */}
        {/* 🌟 消息列表 */}
        <Bubble.List
          autoScroll
          items={
            items.length > 0
              ? items
              : [{ content: null, variant: "borderless" }]
          }
          roles={roles(user!)}
          className={styles.messages}
        />
        {/* </div> */}

        {/* 🌟 输入框 */}
        <div>
          <CustomSender
            content={content}
            onEnhance={() => enhanceDescription(content)}
            onSubmit={() => onSubmit(content)}
            setContent={setContent}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      </div>
    </>
  );
};

export default Independent;
