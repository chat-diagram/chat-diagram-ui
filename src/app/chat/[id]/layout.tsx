"use client";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Attachments,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Welcome,
  useXAgent,
  useXChat,
} from "@ant-design/x";
import { createStyles } from "antd-style";
import React, { createContext, useContext, useEffect, useState } from "react";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

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
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveEditor from "./@live-editor/page";

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
    ResizeHandleOuter: css`
      outline: none;
      background: rgba(0, 0, 0, 0.1) !important;
    `,
  };
});

// 定义 Context
interface ChatContextType {
  mermaidCode: string;
  setMermaidCode: (code: string) => void;
  enhancedDescription: string;
  setEnhancedDescription: (desc: string) => void;
}
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider 组件
function ChatProvider({ children }: { children: React.ReactNode }) {
  const [mermaidCode, setMermaidCode] = useState("");
  const [enhancedDescription, setEnhancedDescription] = useState("");

  return (
    <ChatContext.Provider
      value={{
        mermaidCode,
        setMermaidCode,
        enhancedDescription,
        setEnhancedDescription,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
// Hook
export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
}

const Layout = ({ chat }: { chat: React.ReactNode }) => {
  const { id } = useParams();

  // ==================== Style ====================
  const { styles } = useStyle();

  // ==================== State ====================

  // ==================== Runtime ====================

  const PanelResizeHandleWithStyle = ({
    vertical,
    onClick,
  }: {
    vertical?: boolean;
    onClick?: () => void;
  }) => {
    return (
      <PanelResizeHandle
        className={[
          styles.ResizeHandleOuter,
          ` transition-colors duration-200 ${vertical ? "h-[1px]" : "w-[1px]"}`,
        ].join(" ")}
        onClick={onClick}
      >
        {/* <div className={styles.ResizeHandleInner}></div> */}
      </PanelResizeHandle>
    );
  };

  const [showRightPanel, setShowRightPanel] = useState(true);

  // ==================== Nodes ====================

  // ==================== Render =================
  return (
    <ChatProvider>
      <div className={styles.layout}>
        <PanelGroup direction="horizontal" className="w-full h-full">
          <Panel minSize={30}>{chat}</Panel>
          <PanelResizeHandleWithStyle onClick={() => {}} />
          {/* <Panel>
          <PanelGroup direction="vertical">
            <Panel>top</Panel>
            <PanelResizeHandleWithStyle vertical={true} />

            <Panel>
              <PanelGroup direction="horizontal">
                <Panel>left</Panel>
                <PanelResizeHandleWithStyle />

                <Panel>right</Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandleWithStyle /> */}

          {showRightPanel && (
            <Panel minSize={30}>
              <LiveEditor />
            </Panel>
          )}
        </PanelGroup>
      </div>
    </ChatProvider>
  );
};

export default Layout;
