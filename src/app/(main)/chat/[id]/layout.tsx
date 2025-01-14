"use client";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { createStyles } from "antd-style";
import React, { createContext, useContext, useState } from "react";

import { usePathname } from "next/navigation";
import LiveEditor from "./@live-editor/page";
import { Diagram, DiagramVersion } from "@/lib/api/diagrams";

const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      min-width: 1000px;
      // height: 722px;
      height: 100%;
      border-radius: ${token.borderRadius}px;
      display: flex;
      // background: ${token.colorBgContainer};
      // font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

      .ant-prompts {
        // color: ${token.colorText};
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
      // box-shadow: ${token.boxShadow};
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
      // background:
      background: hsl(var(--border)) !important;
    `,
  };
});

// 定义 Context
interface ChatContextType {
  mermaidCode: string;
  setMermaidCode: (code: string) => void;
  enhancedDescription: string;
  setEnhancedDescription: (desc: string) => void;
  showRightPanel: boolean;
  setShowRightPanel: (show: boolean) => void;
  editorMounted: boolean;
  setEditorMounted: (mounted: boolean) => void;
  activeDiagramVersion: DiagramVersion | null;
  setActiveDiagramVersion: (version: DiagramVersion | null) => void;
  diagram: Diagram | null;
  setDiagram: (diagram: Diagram) => void;
}
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider 组件
function ChatProvider({ children }: { children: React.ReactNode }) {
  const [mermaidCode, setMermaidCodeOrigin] = useState("");
  const [enhancedDescription, setEnhancedDescription] = useState("");
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [editorMounted, setEditorMounted] = useState(false);
  const [activeDiagramVersion, setActiveDiagramVersion] = useState(null);
  const [diagram, setDiagram] = useState<Diagram | null>(null);

  const setMermaidCode = (code: string) => {
    function filterMermaidComments(mermaidCode: string) {
      /**
       * 过滤掉第一行和最后一行的注释。
       *
       * @param {string} mermaidCode - 包含Mermaid代码的字符串
       * @return {string} 过滤后的Mermaid代码
       */
      const lines = mermaidCode.split("\n");

      // 检查并过滤第一行和最后一行的注释
      if (lines.length > 0 && lines[0] === "```mermaid") {
        lines.shift();
      }
      if (lines.length > 0 && lines[lines.length - 1] === "```") {
        lines.pop();
      }

      return lines.join("\n");
    }
    const filteredCode = filterMermaidComments(code);
    setMermaidCodeOrigin(filteredCode);
  };

  return (
    <ChatContext.Provider
      value={{
        mermaidCode,
        setMermaidCode,
        enhancedDescription,
        setEnhancedDescription,
        showRightPanel,
        setShowRightPanel,
        editorMounted,
        setEditorMounted,
        activeDiagramVersion,
        setActiveDiagramVersion,
        diagram,
        setDiagram,
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
  const pathname = usePathname();
  // 如果是 projects 路径，触发 404 处理，让 Next.js 继续匹配其他路由
  if (pathname?.includes("/projects")) {
    // redirect(pathname);
  }
  // const params = useParams();
  // const { id } = params;
  const { showRightPanel, setShowRightPanel } = useChatContext();

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

  // ==================== Nodes ====================

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      <PanelGroup direction="horizontal" className="w-full h-full">
        <Panel
          minSize={30}
          className="flex flex-col "
          style={{ maxHeight: "100vh" }}
        >
          {chat}
        </Panel>
        <PanelResizeHandleWithStyle
          onClick={() => {
            setShowRightPanel(!showRightPanel);
          }}
        />
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
          <Panel minSize={30} style={{ minWidth: "400px" }}>
            <LiveEditor />
          </Panel>
        )}
      </PanelGroup>
    </div>
  );
};

const LayoutWithProvider = ({ chat }: { chat: React.ReactNode }) => {
  return (
    <ChatProvider>
      <Layout chat={chat} />
    </ChatProvider>
  );
};
export default LayoutWithProvider;
