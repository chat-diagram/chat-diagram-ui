"use client";
import MonacoEditor from "@/components/monaco-editor";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import mermaid from "mermaid";
import { useEffect, useState } from "react";
import { useChatContext } from "../layout";
import {
  Check,
  ChevronsRight,
  Download,
  Redo2,
  Share,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/request";
import { useParams } from "next/navigation";
import { Diagram, diagramsApi, ShareExpireTime } from "@/lib/api/diagrams";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRollbackDiagramVersion } from "@/hooks/use-diagrams";
import { useTheme } from "next-themes";
import { useI18n } from "@/i18n";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadSvgAsPng } from "@/lib/utils";
import {
  DownloadButton,
  LatestVersionBadge,
  RollbackVersionBadge,
} from "./components";
import { Svg2Roughjs } from "svg2roughjs";
import { PreviewToolbar } from "./components/preview-toobar";
import { CodeEditorToolbar } from "./components/code-editor-toolbar";

const LiveEditor = () => {
  const t = useI18n();
  const {
    mermaidCode,
    setMermaidCode,
    setShowRightPanel,
    setActiveDiagramVersion,
    activeDiagramVersion,
    isSharePage,
    editorState,
    setEditorState,
  } = useChatContext();

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
      // // 语法正确才进行渲染
      const result = await mermaid.render("mermaid-preview", code);
      console.log("result", document.getElementById("mermaid-preview"));

      const container = document.getElementById("mermaid-preview-container")!;

      container.innerHTML = result.svg;

      const graphDiv =
        document.querySelector<SVGSVGElement>("#mermaid-preview")!;
      if (editorState.rough) {
        // debugger;
        // setMermaidContent(result.svg);

        // // 创建一个临时的 div 来解析 SVG 字符串
        // const tempDiv = document.createElement("div");
        // tempDiv.innerHTML = result.svg;
        // const graphDiv = tempDiv.querySelector("svg");
        const svg2roughjs = new Svg2Roughjs("#mermaid-preview-container");
        // if (!svg2roughjs.svg) {
        //   throw new Error("svg2roughjs.svg is null");
        // }
        svg2roughjs.svg = graphDiv;
        await svg2roughjs.sketch();
        graphDiv.remove();
        const sketch = document.querySelector<HTMLElement>(
          "#mermaid-preview-container > svg"
        );
        if (!sketch) {
          throw new Error("sketch not found");
        }
        const height = sketch.getAttribute("height");
        const width = sketch.getAttribute("width");
        sketch.setAttribute("height", "100%");
        sketch.setAttribute("width", "100%");
        sketch.setAttribute("id", "mermaid-preview");
        sketch.setAttribute("viewBox", `0 0 ${width} ${height}`);
        sketch.style.maxWidth = "100%";
      } else {
        graphDiv.setAttribute("height", "100%");
        graphDiv.style.maxWidth = "100%";
        // if (bindFunctions) {
        //   bindFunctions(graphDiv);
        // }
      }
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
    const initializeMermaid = () => {
      mermaid.initialize({
        startOnLoad: true,
        securityLevel: "loose",
        theme: finalTheme,
      });
    };
    // 在组件挂载后初始化 mermaid
    const init = () => {
      updateTheme();
      initializeMermaid();

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
      initializeMermaid();
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
  }, [nextTheme]);

  useEffect(() => {
    renderMermaid(mermaidCode);
  }, [mermaidCode]);

  useEffect(() => {
    renderMermaid(mermaidCode);
  }, [editorState]);

  const handleEditorDidMount = () => {
    if (mermaidCode) {
      renderMermaid(mermaidCode);
    }
  };

  const [shareIconState, setShareIconState] = useState<"share" | "success">(
    "share"
  );
  const [shareTime, setShareTime] = useState<ShareExpireTime>("7d");

  const handleShare = async () => {
    let currentUrl = window.location.href;
    if (isSharePage) {
      currentUrl = currentUrl.replace("share=true", "");
    }
    const res = await diagramsApi.shareDiagram(
      activeDiagramVersion?.diagramId || "",
      {
        expiration: shareTime,
      }
    );
    console.log("res", res);
    const url = currentUrl.split("/").slice(0, -1).join("/");
    const shareUrl = `${url}/${res.uuid}?share=true`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      setShareIconState("success");
      // 2秒后恢复原始图标
      setTimeout(() => {
        setShareIconState("share");
      }, 2000);
    });
  };

  const handleDownloadPNG = () => {
    const svgElement = document.getElementById("mermaid-preview");
    if (!svgElement) {
      // message.error(t("diagram.downloadError"));
      return;
    }
    downloadSvgAsPng(svgElement, "mermaid-diagram.png");
  };

  const [showDownLoad, setShowDownLoad] = useState(false);
  return (
    <div className="flex flex-col h-screen" style={{ minWidth: "400px" }}>
      <div className="w-full p-1 border-b  flex items-center gap-2">
        {!isSharePage && (
          <Button
            size="mini"
            variant="ghost"
            onClick={() => setShowRightPanel(false)}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        )}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="preview">{t("diagram.previewBtn")}</TabsTrigger>
            <TabsTrigger value="code">{t("diagram.codeBtn")}</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="ml-auto flex items-center gap-2">
          {/* 版本控制 */}
          {!isSharePage && (
            <>
              {diagram?.currentVersion ===
              activeDiagramVersion?.versionNumber ? (
                <LatestVersionBadge />
              ) : (
                <RollbackVersionBadge onClick={handleRollbackDiagramVersion} />
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
                    disabled={
                      versionLength === activeDiagramVersion?.versionNumber
                    }
                    onClick={handleNextVersion}
                  >
                    <Redo2 className="w-2 h-2" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("diagram.laterTooltip")}</p>
                </TooltipContent>
              </Tooltip>
              <Separator orientation="vertical" className="h-4" />
            </>
          )}
          {/* 分享 */}
          {!isSharePage && (
            <Popover open={showDownLoad} onOpenChange={setShowDownLoad}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      size="h5"
                      variant="ghost"
                      onClick={() => {
                        setShowDownLoad(true);
                      }}
                    >
                      <div className={"w-4 h-4"}>
                        <Share
                          className={`w-4 h-4 transition-all duration-300 `}
                        />
                      </div>
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("diagram.share")}</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent>
                <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
                  {t("diagram.shareExpireTime")}
                </h3>
                <div className="flex items-center gap-2">
                  <Select value={shareTime} onValueChange={setShareTime}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("diagram.selectPlaceholder")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">{t("diagram.7d")}</SelectItem>
                      <SelectItem value="15d">{t("diagram.15d")}</SelectItem>
                      <SelectItem value="never">
                        {t("diagram.never")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2 relative">
                    <Button onClick={handleShare} variant={"ghost"}>
                      <Share
                        className={`w-4 h-4 absolute transition-all duration-300 ${
                          shareIconState === "share"
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />

                      <Check
                        className={`w-4 h-4 absolute text-green-500 transition-all duration-300 ${
                          shareIconState === "success"
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          {/* 下载 */}
          <DownloadButton handleDownloadPNG={handleDownloadPNG} />
        </div>
      </div>
      {/* tab-code */}
      <div
        className={`w-full h-full ${activeTab === "code" ? "block" : "hidden"}`}
      >
        <CodeEditorToolbar />
        <MonacoEditor
          value={mermaidCode}
          onChange={handleCodeChange}
          language="mermaid"
          theme="light"
          height="100%"
          onMount={handleEditorDidMount}
        />
      </div>
      {/* tab-preview */}
      <div
        className={`${
          activeTab === "preview" ? "block" : "invisible"
        } flex-1 overflow-auto`}
      >
        <div className="flex flex-col h-full">
          <PreviewToolbar />
          <div
            id="mermaid-preview-container"
            className={`mermaid-preview-container w-full h-full p-4 flex justify-center ${
              isError ? "opacity-50" : ""
            }`}
            // dangerouslySetInnerHTML={{ __html: mermaidContent }}
          ></div>
          {isError && (
            <div className="text-red-500 text-sm p-2">
              {t("diagram.syntaxError")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveEditor;
