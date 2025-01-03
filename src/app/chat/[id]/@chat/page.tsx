"use client";
import {
  Attachments,
  Bubble,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
} from "@ant-design/x";
import { createStyles } from "antd-style";
import React, { useEffect, useState } from "react";
import OpenAI from "openai";
import {
  CloudUploadOutlined,
  CommentOutlined,
  EllipsisOutlined,
  FireOutlined,
  HeartOutlined,
  PaperClipOutlined,
  PlusOutlined,
  ReadOutlined,
  ShareAltOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Badge, Button, type GetProp, Space } from "antd";
import { useChatContext } from "../layout";
import { Sparkles } from "lucide-react";

const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

const defaultConversationsItems = [
  {
    key: "0",
    label: "What is Ant Design X?",
  },
];

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
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

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
      height: 100%;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: ${token.paddingLG}px;
      gap: 16px;
    `,
    messages: css`
      flex: 1;
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
  };
});

const placeholderPromptsItems: GetProp<typeof Prompts, "items"> = [
  {
    key: "1",
    label: renderTitle(
      <FireOutlined style={{ color: "#FF4D4F" }} />,
      "Hot Topics"
    ),
    description: "What are you interested in?",
    children: [
      {
        key: "1-1",
        description: `What's new in X?`,
      },
      {
        key: "1-2",
        description: `What's AGI?`,
      },
      {
        key: "1-3",
        description: `Where is the doc?`,
      },
    ],
  },
  {
    key: "2",
    label: renderTitle(
      <ReadOutlined style={{ color: "#1890FF" }} />,
      "Design Guide"
    ),
    description: "How to design a good product?",
    children: [
      {
        key: "2-1",
        icon: <HeartOutlined />,
        description: `Know the well`,
      },
      {
        key: "2-2",
        icon: <SmileOutlined />,
        description: `Set the AI role`,
      },
      {
        key: "2-3",
        icon: <CommentOutlined />,
        description: `Express the feeling`,
      },
    ],
  },
];

const senderPromptsItems: GetProp<typeof Prompts, "items"> = [
  //   {
  //     key: "1",
  //     description: "Hot Topics",
  //     icon: <FireOutlined style={{ color: "#FF4D4F" }} />,
  //   },
  //   {
  //     key: "2",
  //     description: "Design Guide",
  //     icon: <ReadOutlined style={{ color: "#1890FF" }} />,
  //   },
  {
    key: "3",
    description: "优化描述",
    icon: (
      <div className="flex items-center justify-center w-[14px] h-[22px]">
        <Sparkles style={{ color: "#1890FF", width: "14px", height: "22px" }} />
      </div>
    ),
  },
];

const roles: GetProp<typeof Bubble.List, "roles"> = {
  ai: {
    placement: "start",
    typing: { step: 5, interval: 20 },
    styles: {
      content: {
        borderRadius: 16,
      },
    },
  },
  local: {
    placement: "end",
    variant: "shadow",
  },
};

const Independent: React.FC = () => {
  //   const { id } = useParams();

  // ==================== Style ====================
  const { styles } = useStyle();

  // ==================== State ====================
  const [headerOpen, setHeaderOpen] = React.useState(false);

  const [content, setContent] = React.useState("");

  const [activeKey, setActiveKey] = React.useState(
    defaultConversationsItems[0].key
  );

  const [attachedFiles, setAttachedFiles] = React.useState<
    GetProp<typeof Attachments, "items">
  >([]);

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess }) => {
      onSuccess(`Mock success return. You said: ${message}`);
    },
  });

  const { onRequest, messages, setMessages } = useXChat({
    agent,
  });

  useEffect(() => {
    if (activeKey !== undefined) {
      setMessages([]);
    }
  }, [activeKey]);

  // ==================== Event ====================
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return;
    debugger;
    onRequest(nextContent);
    setContent("");
    // setMermaidCode(nextContent);
    generateMermaidCode(nextContent);
  };

  const onPromptsItemClick: GetProp<typeof Prompts, "onItemClick"> = (info) => {
    if (info.data.key === "3") {
      enhanceDescription(content as string);
      return;
    }
    onRequest(info.data.description as string);
  };

  const handleFileChange: GetProp<typeof Attachments, "onChange"> = (info) =>
    setAttachedFiles(info.fileList);

  // ==================== Nodes ====================
  const placeholderNode = (
    <Space direction="vertical" size={16} className={styles.placeholder}>
      <Welcome
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="Hello, I'm Ant Design X"
        description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
        extra={
          <Space>
            <Button icon={<ShareAltOutlined />} />
            <Button icon={<EllipsisOutlined />} />
          </Space>
        }
      />
      <Prompts
        title="Do you want?"
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: "100%",
          },
          item: {
            flex: 1,
          },
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  );

  const items: GetProp<typeof Bubble.List, "items"> = messages.map(
    ({ id, message, status }) => ({
      key: id,
      loading: status === "loading",
      role: status === "local" ? "local" : "ai",
      content: message,
    })
  );

  const attachmentsNode = (
    <Badge dot={attachedFiles.length > 0 && !headerOpen}>
      <Button
        type="text"
        icon={<PaperClipOutlined />}
        onClick={() => setHeaderOpen(!headerOpen)}
      />
    </Badge>
  );

  const senderHeader = (
    <Sender.Header
      title="Attachments"
      open={headerOpen}
      onOpenChange={setHeaderOpen}
      styles={{
        content: {
          padding: 0,
        },
      }}
    >
      <Attachments
        beforeUpload={() => false}
        items={attachedFiles}
        onChange={handleFileChange}
        placeholder={(type) =>
          type === "drop"
            ? { title: "Drop file here" }
            : {
                icon: <CloudUploadOutlined />,
                title: "Upload files",
                description: "Click or drag files to this area to upload",
              }
        }
      />
    </Sender.Header>
  );

  const [isLoading, setIsLoading] = useState(false);

  // 第一步：增强用户描述
  const enhanceDescription = async (description: string) => {
    try {
      setIsLoading(true);
      const openai = new OpenAI({
        baseURL: process.env.NEXT_PUBLIC_OPENAI_API_BASE_URL,
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const stream = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `作为一位精通 Mermaid 图表绘制的专家，请根据以下内容优化用户提供的描述，使其更加清晰、完整且适合用于 Mermaid 图表的设计。请注意，返回的内容应为文字描述，而不是 Mermaid 的代码。

要求：优化后的描述需符合示例中的格式与要求，语言简洁明了，总字数不超过 400 字。
示例：
请设计一个详细且易于理解的用户登录时序图，清晰展示用户登录过程中的各个步骤及参与者之间的交互。此图应包括：用户输入凭证的环节、系统验证凭证的过程，以及根据验证结果返回成功或失败响应的流程。图中需标明所有参与者（如用户、前端界面、后端服务器和数据库等）及其之间的消息传递顺序。通过该时序图，可以直观了解用户登录的完整流程及关键环节，从而提升系统的可用性和用户体验。
接下来是用户的描述，请基于示例的要求和格式进行优化，使其适用于 Mermaid 支持的各种图表类型（如流程图、时序图、甘特图、状态图等）。请确保返回的是文字描述，而非 Mermaid 的代码，并使表达更加清晰和完整：
${description}`,
          },
        ],
        model: "deepseek-chat",
        stream: true, // 启用流式返回
      });
      let fullResponse = "";

      // 逐步读取流式响应
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullResponse += content;
        // 实时更新响应内容
        setEnhancedDescription(fullResponse);
        setContent(fullResponse);
      }

      //   const response = await fetch("/api/enhance-description", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       description,
      //       prompt: `作为一个流程图专家，请帮我优化和详细化以下流程描述，使其更加清晰和完整：
      //               ${description}
      //               请列出所有可能的步骤、条件和分支。保持专业性和逻辑性。`,
      //     }),
      //   });
      //   const data = await response.json();
      return fullResponse;
    } catch (error) {
      console.error("增强描述失败:", error);
      throw error;
    }
  };

  // 第二步：生成 Mermaid DSL
  const generateMermaidCode = async (description: string) => {
    try {
      const openai = new OpenAI({
        baseURL: process.env.NEXT_PUBLIC_OPENAI_API_BASE_URL,
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const stream = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `请根据以下描述生成一个 Mermaid 的 DSL 代码：
                        ${description}

                        要求：

                1. 自动判断最合适的 Mermaid 图表类型（如 sequenceDiagram、graph TD、stateDiagram 等）
                2. 使用正确的语法和合适的图表类型
                3. 节点 ID 必须有意义且唯一
                4. 确保语法正确
                5. 适当使用不同的形状和样式
                6. 只返回 Mermaid DSL 代码，不要其他解释
                7. 不要使用任何注释
                8. 不要使用任何代码块
                9. 不要出现 \`\`\` 代码块
                   `,
          },
        ],
        model: "deepseek-chat",
        stream: true, // 启用流式返回
      });
      let fullResponse = "";

      // 逐步读取流式响应
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullResponse += content;
        // 实时更新响应内容
        setMermaidCode(fullResponse);
        // setContent(fullResponse);
      }

      //   const response = await fetch("/api/generate-mermaid", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       description,
      //       prompt: `请根据以下流程描述生成一个 Mermaid 流程图的 DSL 代码：
      //               ${description}
      //               要求：
      //               1. 使用 graph TD 语法
      //               2. 节点 ID 要有意义且唯一
      //               3. 确保语法正确
      //               4. 适当使用不同的形状和样式
      //               5. 只返回 Mermaid DSL 代码，不要其他解释`,
      //     }),
      //   });
      //   const data = await response.json();
      //   setMermaidCode(data.mermaidCode);
    } catch (error) {
      console.error("生成 Mermaid 代码失败:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const { setMermaidCode, setEnhancedDescription } = useChatContext();
  // ==================== Render =================
  return (
    <div className={styles.chat}>
      {/* 🌟 消息列表 */}
      <Bubble.List
        items={
          items.length > 0
            ? items
            : [{ content: placeholderNode, variant: "borderless" }]
        }
        roles={roles}
        className={styles.messages}
      />
      {/* 🌟 提示词 */}
      <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} />
      {/* 🌟 输入框 */}
      <Sender
        value={content}
        header={senderHeader}
        onSubmit={onSubmit}
        onChange={setContent}
        prefix={attachmentsNode}
        loading={agent.isRequesting()}
        className={styles.sender}
      />
    </div>
  );
};

export default Independent;
