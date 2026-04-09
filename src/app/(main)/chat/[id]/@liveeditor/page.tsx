"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import mermaid from "mermaid";
import { renderMermaidSVG } from "beautiful-mermaid";
import { waitForRender } from "@/lib/utils/autoSync";
import dayjs from "@/lib/utils/dayjs";
import { toBase64 } from "js-base64";
import { useEffect, useState } from "react";
import { useChatContext } from "../layout";
import { Check, Copy, Download, Redo2, Share, Undo2 } from "lucide-react";
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
import { downloadSvgAsPng, simulateDownload } from "@/lib/utils";
import RollbackVersionBadge from "./components/rollback-version-badge";
import LatestVersionBadge from "./components/latest-version-badge";
import { Svg2Roughjs } from "svg2roughjs";
import { DiagramToolbar } from "../../../../../components/diagram/diagram-toobar";
import { CodeEditorToolbar } from "../../../../../components/code/code-editor-toolbar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CodeEditor from "@/components/code/code-editor";
import DiagramBoard from "./components/diagram-board";

const LiveEditor = ({ children }: { children: React.ReactNode }) => {
  const t = useI18n();
  const {
    mermaidCode,
    setMermaidCode,
    setActiveDiagramVersion,
    activeDiagramVersion,
    isSharePage,
    editorState,
    setEditorState,
  } = useChatContext();

  const [activeTab, setActiveTab] = useState("diagram");
  // 存储mermaid的svg内容
  const [svgContent, setSvgContent] = useState("");

  const [isError, setIsError] = useState(false);

  const renderMermaid = async (code: string) => {
    try {
      // 先验证语法

      await mermaid.parse(code);
      // const svg = await renderMermaidSVG(code);
      // // 语法正确才进行渲染
      // const result = await mermaid.render(`mermaid-${Date.now()}`, code);
      const result = renderMermaidSVG(code, {
        bg: "transparent",
      });
      console.log("result", document.getElementById("mermaid-preview"));
      // setSvgContent(result.svg);
      setSvgContent(result);
      const graphDiv =
        document.querySelector<SVGSVGElement>("#mermaid-preview")!;
      if (editorState.rough) {
        const tempContainer = document.createElement("div");
        tempContainer.style.position = "absolute";
        tempContainer.style.left = "-9999px";
        tempContainer.id = "temp-rough-container";
        document.body.appendChild(tempContainer);

        tempContainer.innerHTML = result.svg;
        const originalSvg = tempContainer.querySelector("svg");

        // 保存原始文字节点
        const textNodes = originalSvg.querySelectorAll("text");
        const savedTexts = Array.from(textNodes).map((t) => t.cloneNode(true));

        const svg2roughjs = new Svg2Roughjs("#temp-rough-container");
        svg2roughjs.svg = originalSvg;
        await svg2roughjs.sketch();

        originalSvg.remove();
        const sketch = tempContainer.querySelector("svg");

        if (sketch) {
          // 把原始文字补回去
          savedTexts.forEach((text) => sketch.appendChild(text));

          const height = sketch.getAttribute("height");
          const width = sketch.getAttribute("width");
          sketch.setAttribute("viewBox", `0 0 ${width} ${height}`);
          sketch.style.maxWidth = "100%";
          setSvgContent(sketch.outerHTML);
        }

        document.body.removeChild(tempContainer);
      } else {
        graphDiv.style.maxWidth = "100%";
      }
      setIsError(false);
    } catch (error) {
      console.log("Mermaid 渲染错误:", error);
      // setIsError(true);
      // 发生错误时不更新 mermaidContent，保留上次的正确结果
    }
  };

  const handleCodeChange = (value: string) => {
    setMermaidCode(value);
  };
  const { id } = useParams();

  const diagram = queryClient.getQueryData<Diagram>(["diagram", id]);
  const versionLength = diagram?.versions.length;

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
  const getFileName = (extension: string) =>
    `chat-diagram-${dayjs().format("YYYY-MM-DD-HHmmss")}.${extension}`;
  const handleDownloadPNG = () => {
    const svgElement = document.getElementById("mermaid-preview");
    if (!svgElement) {
      // message.error(t("diagram.downloadError"));
      return;
    }
    downloadSvgAsPng(svgElement, "mermaid-diagram.png");
  };
  const getSvgElement = () => {
    const svgElement = document
      .querySelector("#mermaid-preview-container svg")
      ?.cloneNode(true) as HTMLElement;
    svgElement.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    return svgElement;
  };
  const getBase64SVG = (
    svg?: HTMLElement,
    width?: number,
    height?: number
  ): string => {
    if (svg) {
      // Prevents the SVG size of the interface from being changed
      svg = svg.cloneNode(true) as HTMLElement;
    }
    // 添加字体样式
    const style = document.createElement("style");
    style.textContent = `
    @font-face {
      font-family: 'Your-Font';
      src: url('your-font.woff2') format('woff2');
    }
  `;
    svg?.insertBefore(style, svg.firstChild);

    // 确保正确的viewBox
    height && svg?.setAttribute("height", `${height}px`);
    width && svg?.setAttribute("width", `${width}px`); // Workaround https://stackoverflow.com/questions/28690643/firefox-error-rendering-an-svg-image-to-html5-canvas-with-drawimage
    svg?.setAttribute("preserveAspectRatio", "xMidYMid meet");
    if (!svg) {
      svg = getSvgElement();
    }
    const svgString = svg.outerHTML
      .replaceAll("<br>", "<br/>")
      .replaceAll(/<img([^>]*)>/g, (m, g: string) => `<img ${g} />`);

    //     return toBase64(`<?xml version="1.0" encoding="UTF-8"?>
    // <?xml-stylesheet href="${FONT_AWESOME_URL}" type="text/css"?>
    // ${svgString}`);
    return toBase64(`<?xml version="1.0" encoding="UTF-8"?>
  ${svgString}`);
  };
  const onDownloadSVG = () => {
    simulateDownload(
      getFileName("svg"),
      `data:image/svg+xml;base64,${getBase64SVG()}`
    );
  };
  const downloadImage: Exporter = (context, image) => {
    return () => {
      const { canvas } = context;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      simulateDownload(
        getFileName("png"),
        canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
      );
    };
  };
  const onDownloadPNG = async (event: Event) => {
    await exportImage(event, downloadImage);
  };
  type Exporter = (
    context: CanvasRenderingContext2D,
    image: HTMLImageElement
  ) => () => void;

  const clipboardCopy: Exporter = (context, image) => {
    return () => {
      const { canvas } = context;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        try {
          if (!blob) {
            throw new Error("blob is empty");
          }
          void navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob,
            }),
          ]);
        } catch (error) {
          console.error(error);
        }
      });
    };
  };
  const exportImage = async (event: Event, exporter: Exporter) => {
    await waitForRender();
    // if (document.querySelector(".outOfSync")) {
    //   throw new Error("Diagram is out of sync");
    // }
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const svg = document.querySelector<HTMLElement>("#mermaid-preview");
    if (!svg) {
      throw new Error("svg not found");
    }
    const box: DOMRect = svg.getBoundingClientRect();
    canvas.width = box.width;
    canvas.height = box.height;
    if (imagemodeselected === "width") {
      const ratio = box.height / box.width;
      canvas.width = userimagesize;
      canvas.height = userimagesize * ratio;
    } else if (imagemodeselected === "height") {
      const ratio = box.width / box.height;
      canvas.width = userimagesize * ratio;
      canvas.height = userimagesize;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("context not found");
    }
    // context.fillStyle = `hsl(${window
    //   .getComputedStyle(document.body)
    //   .getPropertyValue("--b1")})`;
    // context.fillRect(0, 0, canvas.width, canvas.height);

    const image = new Image();
    image.addEventListener("load", exporter(context, image));
    image.src = `data:image/svg+xml;base64,${getBase64SVG(
      svg,
      canvas.width,
      canvas.height
    )}`;

    event.stopPropagation();
    event.preventDefault();
  };

  const onCopyClipboard = async (event: Event) => {
    await exportImage(event, clipboardCopy);
  };

  const [showShare, setShowShare] = useState(false);
  const [showDownLoad, setShowDownLoad] = useState(false);

  const [imagemodeselected, setImagemodeselected] = useState<
    "autosize" | "width" | "height"
  >("autosize");
  const [userimagesize, setUserimagesize] = useState(1080);
  return (
    <div
      className="flex flex-col h-screen relative"
      style={{ minWidth: "400px" }}
    >
      <div className="w-full p-1 border-b  flex items-center justify-end gap-2">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="ml-auto"
        >
          <TabsList>
            <TabsTrigger value="diagram">{t("diagram.previewBtn")}</TabsTrigger>
            <TabsTrigger value="code">{t("diagram.codeBtn")}</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className=" flex items-center gap-2">
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
          {!isSharePage && (
            <Popover open={showShare} onOpenChange={setShowShare}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button
                      size="h5"
                      variant="ghost"
                      onClick={() => {
                        setShowShare(true);
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
                      <Download className="w-4 h-4" />
                    </div>
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("diagram.export")}</p>
              </TooltipContent>
            </Tooltip>
            <PopoverContent
              className="flex flex-col gap-2 "
              style={{ minWidth: 400 }}
            >
              {/* <h3 className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
                {t("diagram.shareExpireTime")}
              </h3> */}
              <div className="flex items-center gap-2">
                <Button
                  className="action-btn w-full"
                  variant="outline"
                  onClick={onCopyClipboard}
                >
                  <Copy /> {t("diagram.exportCopy")}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  className="action-btn w-full"
                  variant="outline"
                  onClick={onDownloadPNG}
                >
                  <Download /> Png
                </Button>
                <Button
                  variant="outline"
                  className="action-btn w-full"
                  onClick={onDownloadSVG}
                >
                  <Download /> Svg
                </Button>
              </div>
              <div>
                <div className="whitespace-nowrap">PNG size</div>

                <RadioGroup
                  value={imagemodeselected}
                  onValueChange={setImagemodeselected}
                  className="flex items-center gap-2 h-8"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="autosize" id="r1" />
                    <Label htmlFor="r1">Auto</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="width" id="r2" />
                    <Label htmlFor="r2">Width</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="height" id="r3" />
                    <Label htmlFor="r3">Height</Label>
                  </div>
                  {imagemodeselected !== "autosize" && (
                    <Input
                      value={userimagesize}
                      onChange={(e) => setUserimagesize(Number(e.target.value))}
                    />
                  )}
                </RadioGroup>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* tab-code */}
      <div
        className={`w-full h-full ${activeTab === "code" ? "block" : "hidden"}`}
      >
        <CodeEditorToolbar />
        <CodeEditor
          value={mermaidCode}
          onChange={handleCodeChange}
          language="mermaid"
          theme="light"
          height="100%"
          onMount={handleEditorDidMount}
        />
      </div>
      {/* tab-diagram */}
      <div
        className={`${
          activeTab === "diagram" ? "block" : "invisible"
        } flex-1 overflow-auto`}
      >
        <div className="flex flex-col h-full">
          {/* <DiagramToolbar /> */}
          <DiagramBoard svgContent={svgContent} />
          {isError && (
            <div className="text-red-500 text-sm p-2">
              {t("diagram.syntaxError")}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default LiveEditor;
