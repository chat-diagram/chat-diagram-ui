"use client";
import MonacoEditor from "@/components/monaco-editor";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import mermaid from "mermaid";
import { useEffect, useState } from "react";
import { useChatContext } from "../layout";
import { ChevronsRight, Redo2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/request";
import { useParams } from "next/navigation";
import { Diagram } from "@/lib/api/diagrams";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRollbackDiagramVersion } from "@/hooks/use-diagrams";
import { useTheme } from "next-themes";
import { useI18n } from "@/i18n";
const LiveEditor = () => {
  const [activeTab, setActiveTab] = useState("preview");
  // 初始化 mermaid
  // 添加状态来存储 mermaid 图表内容
  const [mermaidContent, setMermaidContent] = useState("");
  //   const [lastSuccessfulContent, setLastSuccessfulContent] = useState(""); // 最后一次成功的内容

  const [isError, setIsError] = useState(false);

  const renderMermaid = async (code: string) => {
    // if (!code.trim()) return;

    try {
      // 先验证语法
      await mermaid.parse(code);

      // 语法正确才进行渲染
      const result = await mermaid.render("mermaid-preview", code);
      setMermaidContent(result.svg);
      setIsError(false);
    } catch (error) {
      console.log("Mermaid 渲染错误:", error);
      setIsError(true);
      // 发生错误时不更新 mermaidContent，保留上次的正确结果
    }
  };

  const handleCodeChange = (value: string) => {
    setMermaidCode(value);
  };
  const { id } = useParams();

  const diagram = queryClient.getQueryData<Diagram>(["diagram", id]);
  const versionLength = diagram?.versions.length;
  console.log("diagram", diagram);
  const {
    mermaidCode,
    setMermaidCode,
    setShowRightPanel,
    setActiveDiagramVersion,
    activeDiagramVersion,
  } = useChatContext();

  const handlePreviousVersion = () => {
    // if (activeDiagramVersion?.versionNumber) {
    setActiveDiagramVersion(
      diagram?.versions[activeDiagramVersion?.versionNumber - 2]
    );
    // }
  };
  const handleNextVersion = () => {
    // if (activeDiagramVersion?.versionNumber) {
    setActiveDiagramVersion(
      diagram?.versions[activeDiagramVersion?.versionNumber]
    );
    // }
  };
  const { mutate: rollbackDiagramVersion } = useRollbackDiagramVersion(
    activeDiagramVersion?.diagramId || ""
  );

  const handleRollbackDiagramVersion = () => {
    console.log("handleRollbackDiagramVersion");
    if (activeDiagramVersion) {
      rollbackDiagramVersion(activeDiagramVersion?.versionNumber || 0);
    }
  };

  const { theme: nextTheme } = useTheme();

  useEffect(() => {
    let finalTheme = nextTheme;
    const updateTheme = () => {
      if (nextTheme === "system") {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          finalTheme = "dark";
        } else {
          finalTheme = "default";
        }
      } else {
        finalTheme = nextTheme === "dark" ? "dark" : "default";
      }
    };
    // 在组件挂载后初始化 mermaid
    const init = () => {
      updateTheme();
      mermaid.initialize({
        startOnLoad: true,
        securityLevel: "loose",
        theme: finalTheme,
      });

      console.log("mermaid初始化完成");

      if (mermaidCode) {
        renderMermaid(mermaidCode);
      }
    };

    init();
    // 创建媒体查询监听器
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const themeChangeHandler = async () => {
      // init();
      // mermaid.updateSiteConfig({
      //   theme: finalTheme,
      // });
      updateTheme();
      mermaid.initialize({
        startOnLoad: true,
        securityLevel: "loose",
        theme: finalTheme,
      });
      // todo 这里获取不到mermaidCode，不知道为什么  render才能把theme的变化也应用上
      if (mermaidCode) {
        renderMermaid(mermaidCode);
      }
    };

    // 添加系统主题变化的监听
    mediaQuery.addEventListener("change", themeChangeHandler);

    // 清理函数
    return () => {
      mediaQuery.removeEventListener("change", themeChangeHandler);
    };
  }, [nextTheme, mermaidCode]);

  useEffect(() => {
    renderMermaid(mermaidCode);
  }, [mermaidCode]);
  const handleEditorDidMount = () => {
    if (mermaidCode) {
      renderMermaid(mermaidCode);
    }
  };

  const t = useI18n();
  return (
    <div className="flex flex-col h-screen" style={{ minWidth: "400px" }}>
      <div className="w-full p-1 border-b  flex items-center gap-2">
        <Button
          size="mini"
          variant="ghost"
          onClick={() => setShowRightPanel(false)}
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="preview">{t("diagram.previewBtn")}</TabsTrigger>
            <TabsTrigger value="code">{t("diagram.codeBtn")}</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="ml-auto flex gap-2">
          {diagram?.currentVersion === activeDiagramVersion?.versionNumber ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="success" className="ml-4">
                  {t("diagram.latestBadge")}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("diagram.latestTooltip")}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  onClick={() => {
                    handleRollbackDiagramVersion();
                  }}
                  variant="secondary"
                  className="ml-4"
                  style={{ cursor: "pointer" }}
                >
                  {t("diagram.rollbackBtn")}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("diagram.rollbackTooltip")}</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="h5"
                variant="ghost"
                disabled={activeDiagramVersion?.versionNumber === 1}
                onClick={handlePreviousVersion}
              >
                <Undo2 className="w-2 h-2" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("diagram.previousTooltip")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="h5"
                variant="ghost"
                disabled={versionLength === activeDiagramVersion?.versionNumber}
                onClick={handleNextVersion}
              >
                <Redo2 className="w-2 h-2" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("diagram.laterTooltip")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div
        className={`w-full h-full ${activeTab === "code" ? "block" : "hidden"}`}
      >
        <MonacoEditor
          value={mermaidCode}
          onChange={handleCodeChange}
          language="mermaid"
          theme="light"
          height="100%"
          onMount={handleEditorDidMount}
        />
      </div>
      <div
        className={`${
          activeTab === "preview" ? "block" : "hidden"
        } flex-1 overflow-auto`}
      >
        <div
          className={`w-full h-full p-4  ${isError ? "opacity-50" : ""}`}
          dangerouslySetInnerHTML={{ __html: mermaidContent }}
        ></div>
        {isError && (
          <div className="text-red-500 text-sm p-2">
            {t("diagram.syntaxError")}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveEditor;
