import React from "react";
import { createStyles } from "antd-style";
import { PlusOutlined } from "@ant-design/icons";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

export function NavAddConversation({
  //   conversationsItems,
  onAddConversation,
}: {
  conversationsItems: { key: string; label: string }[];
  onAddConversation: () => void;
}) {
  const useStyle = createStyles(({ token, css }) => {
    return {
      layout: css`
        width: 100%;
        min-width: 1000px;
        height: 722px;
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
        color: #1677ff;
        border: 1px solid #1677ff34;
        // width: calc(100% - 24px);
        margin: 0 12px 0px 0;
      `,
    };
  });
  const { styles } = useStyle();

  // const defaultConversationsItems = [
  //   {
  //     key: "0",
  //     label: "What is Ant Design X?",
  //   },
  // ];

  // ==================== State ====================

  // const [content, setContent] = React.useState("");

  //   const [conversationsItems, setConversationsItems] = React.useState(
  //     defaultConversationsItems
  //   );

  // const [activeKey, setActiveKey] = React.useState(
  //   defaultConversationsItems[0].key
  // );

  // ==================== Runtime ====================
  // const [agent] = useXAgent({
  //   request: async ({ message }, { onSuccess }) => {
  //     onSuccess(`Mock success return. You said: ${message}`);
  //   },
  // });

  // const { onRequest, messages, setMessages } = useXChat({
  //   agent,
  // });

  // useEffect(() => {
  //   if (activeKey !== undefined) {
  //     setMessages([]);
  //   }
  // }, [activeKey]);

  // ==================== Event ====================
  // const onSubmit = (nextContent: string) => {
  //   if (!nextContent) return;
  //   onRequest(nextContent);
  //   setContent("");
  // };

  // const onPromptsItemClick: GetProp<typeof Prompts, "onItemClick"> = (info) => {
  //   onRequest(info.data.description as string);
  // };

  // const onAddConversation = () => {
  //   setConversationsItems([
  //     ...conversationsItems,
  //     {
  //       key: `${conversationsItems.length}`,
  //       label: `New Conversation ${conversationsItems.length}`,
  //     },
  //   ]);
  //   setActiveKey(`${conversationsItems.length}`);
  // };

  // const onConversationClick: GetProp<typeof Conversations, "onActiveChange"> = (
  //   key
  // ) => {
  //   setActiveKey(key);
  // };

  return (
    <div>
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* 🌟 添加会话 */}
            <SidebarMenuButton
              tooltip="New Conversation"
              onClick={onAddConversation}
              className={styles.addBtn}
              variant="default"
            >
              <PlusOutlined />
              <span>New Conversation</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </div>
  );
}
