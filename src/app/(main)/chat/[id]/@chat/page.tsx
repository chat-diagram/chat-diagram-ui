"use client";
import { Bubble, useXAgent, useXChat } from "@ant-design/x";
import React, { useEffect, useState } from "react";

import { Card, message, type GetProp } from "antd";
import { useChatContext } from "../layout";
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
import { useStyle } from "./styles";
import { Badge } from "@/components/ui/badge";

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
  const [title, setTitle] = useState("");
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
  const [agent] = useXAgent({
    request: async ({ message }, { onUpdate, onSuccess, onError }) => {
      console.log("message", message);
      await generateMermaidCode(
        message as string,
        onUpdate,
        onSuccess,
        onError
      );
    },
  });

  const { onRequest, messages, setMessages } = useXChat({
    agent,
  });
  console.log("messages", messages);

  const { showRightPanel, setShowRightPanel } = useChatContext();
  // ==================== Event ====================
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return;
    setShowRightPanel(true);
    onRequest(nextContent);
    setContent("");
  };

  const queryProjectId = searchParams.get("pid");
  const queryDescription = searchParams.get("d");
  const queryProjectTitle = searchParams.get("title");
  console.log("queryDescription", queryDescription);
  console.log("queryProjectId", queryProjectId);

  // 处理刚创建的情况
  useEffect(() => {
    const init = async () => {
      if (queryDescription && queryProjectId) {
        const messages: MessageInfo<string>[] = [];
        messages.push({
          id: `local-${Date.now()}-${queryProjectId}`,
          message: queryDescription,
          status: "local",
        });
        messages.push({
          id: `ai-${Date.now()}-${queryProjectId}`,
          message: JSON.stringify({
            versionId: "new",
            mermaidCode: "",
            comment: "",
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
        let title = "";
        console.log("lei1");

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

                if (jsonData.status === "generating_title") {
                  // todo 生成标题
                  title += jsonData.content || "";
                  setTitle(title);
                  continue;
                }
                if (jsonData.content) {
                  fullResponse += jsonData.content;
                  // 实时更新UI
                  // setContent(fullResponse);
                  setMermaidCode(fullResponse);
                  setMessages((prev) => {
                    const prevMessages = [...prev];

                    // todo
                    prevMessages[prevMessages.length - 1].message =
                      JSON.stringify({
                        diagramId: jsonData.diagram.id,
                        mermaidCode: fullResponse,
                        comment: jsonData.comment,
                      });
                    // fullResponse;

                    return prevMessages;
                  });
                }
                if (jsonData.diagram) {
                  console.log("jsonData.diagram", jsonData.diagram);
                  // queryClient.invalidateQueries({
                  //   queryKey: ["diagram-project", jsonData.diagram.projectId],
                  // });
                  router.replace(`/chat/${jsonData.diagram.id}`);
                }
              } catch (e) {
                console.log("error", e);
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
        id: `local-${version.id}`,
        message: version.description || diagrams.description,
        status: "local",
      });
      messages.push({
        id: `ai-${version.id}`,
        // message: version.mermaidCode,
        message: JSON.stringify({
          versionId: version.id,
          mermaidCode: version.mermaidCode,
          comment: version.comment,
          versionNumber: version.versionNumber,
        }),
        status: "success",
      });
      if (index === diagrams?.versions.length - 1) {
        setMermaidCode(version.mermaidCode);
        setActiveDiagramVersion(version);
      }
    });
    if (diagrams?.id) {
      setMessages(messages);
    }
  }, [diagrams?.id]);

  // ==================== Nodes ====================
  // const [isShowDiagram, setIsShowDiagramOrigin] =
  useState<DiagramVersion | null>(null);
  const { setActiveDiagramVersion, activeDiagramVersion } = useChatContext();

  // const setIsShowDiagram = (version: DiagramVersion | null) => {
  //   setIsShowDiagramOrigin(version);
  //   setActiveDiagramVersion(version);
  //   // setActiveDiagramVersion(version?.id || null);
  // };

  const messageRender = (message: string, status: MessageStatus) => {
    if (status !== "local") {
      try {
        const { versionId, mermaidCode, comment, versionNumber } =
          JSON.parse(message);
        return (
          <div style={{ marginBottom: 12, lineHeight: "32px" }}>
            {/* <Card
              styles={{
                body: {
                  padding: 0,
                },
              }}
              className={cn(
                "p-4 shadow-md transition-all",
                "bg-muted rounded-r-2xl rounded-tl-2xl"
              )}
            >
              <p className="text-sm">{comment}</p>
            </Card> */}
            <p style={{ marginBottom: 8 }}>{comment}</p>
            <Card
              styles={{
                body: {
                  padding: 16,
                },
              }}
              onClick={() => {
                setActiveDiagramVersion(
                  diagrams?.versions.find((one) => one.id === versionId) || {
                    id: versionId,
                    mermaidCode: mermaidCode,
                    description: "",
                    createdAt: "",
                    updatedAt: "",
                    versionNumber: 0,
                    comment: comment,
                    diagramId: id as string,
                  }
                );
                setMermaidCode(mermaidCode);
                setShowRightPanel(true);
              }}
              // hoverable
              // className="hover:shadow-md hover:border-blue-400"
              style={{
                cursor: "pointer",
                outline:
                  activeDiagramVersion?.id === versionId && showRightPanel
                    ? "1px solid #1677ff"
                    : "",
              }}
            >
              {/* {mermaidCode} */}
              <span className="text-sm text-gray-500">
                {versionId === "new" ? (
                  <div className="flex items-center">
                    Generating diagram
                    <div style={{ width: "2em" }}>
                      <span className={styles.loadingDots}></span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p>Generated diagram</p>
                    <Badge variant="secondary" className="text-gray-500">
                      v{versionNumber}
                    </Badge>
                  </div>
                )}
              </span>
              {/* <div className="aspect-video w-full max-w-md bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground">
                Generated Diagram Preview
              </div> */}
            </Card>
          </div>
        );
      } catch (e) {
        console.log("message render error", e);
        return <div>{message}</div>;
      }
    }
    return <p style={{ lineHeight: "32px" }}>{message}</p>;
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
    onSuccess: (mermaidCode: string) => void,
    onError: (error: Error) => void
  ) => {
    try {
      setIsLoading(true);
      const response = await diagramsApi.createDiagramVersion(id as string, {
        description,
      });
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
              if (jsonData.status === "error") {
                message.error(jsonData.message);
                onError(new Error("asd"));
                break;
              }
              if (jsonData.content) {
                fullResponse += jsonData.content;
                // 实时更新UI
                setMermaidCode(fullResponse);
                // onUpdate(fullResponse);
                onUpdate(
                  JSON.stringify({
                    versionId: "new",
                    mermaidCode: fullResponse,
                  })
                );
              }

              if (jsonData.version) {
                // onSuccess(jsonData.version.mermaidCode);
                setActiveDiagramVersion(jsonData.version);
                message.success("generated successfully");

                onSuccess(
                  JSON.stringify({
                    versionId: jsonData.version.id,
                    mermaidCode: jsonData.version.mermaidCode,
                    versionNumber: jsonData.version.versionNumber,
                  })
                );
                // 成功生成后把id从new设置为diagramid
                setMessages((prev) => {
                  const prevMessages = [...prev];
                  diagrams?.versions.push(jsonData.version);
                  prevMessages[
                    prevMessages.length - 1
                  ].id = `ai-${jsonData.version.id}`;
                  prevMessages[prevMessages.length - 1].message =
                    JSON.stringify({
                      versionId: jsonData.version.id,
                      mermaidCode: jsonData.version.mermaidCode,
                      versionNumber: jsonData.version.versionNumber,
                      comment: jsonData.version.comment,
                    });
                  // prevMessages[prevMessages.length - 1].message =
                  //   JSON.stringify(jsonData.version);
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
              console.log("generateMermaidCode error", e);
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

  // ==================== Render =================
  return (
    <>
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
                {queryProjectTitle ? (
                  <span>{queryProjectTitle}</span>
                ) : (
                  <Link href={`/chat/projects/${diagrams?.projectId}`}>
                    {diagrams?.project?.name}
                  </Link>
                )}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {queryProjectTitle ? (
                <span>{title}</span>
              ) : (
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
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
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
