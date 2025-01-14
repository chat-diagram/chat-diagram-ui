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
    // 在组件挂载后初始化 mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: nextTheme === "dark" ? "dark" : "default",
      securityLevel: "loose",
    });
    console.log("mermaid初始化完成");

    if (mermaidCode) {
      renderMermaid(mermaidCode);
    }
  }, [nextTheme]); // 空依赖数组确保只在挂载时执行一次

  useEffect(() => {
    renderMermaid(mermaidCode);
  }, [mermaidCode]);
  const handleEditorDidMount = () => {
    if (mermaidCode) {
      renderMermaid(mermaidCode);
    }
  };

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
            <TabsTrigger value="preview">预览</TabsTrigger>
            <TabsTrigger value="code">代码</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="ml-auto flex gap-2">
          {diagram?.currentVersion === activeDiagramVersion?.versionNumber ? (
            <Badge variant="success" className="ml-4">
              最新版本
            </Badge>
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
                  回滚到此版本
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>回滚到此版本，之后的版本会被删除</p>
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
              <p>查看上一个版本</p>
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
              <p>查看下一个版本</p>
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
            语法错误，请检查您的 Mermaid 语法
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveEditor;
