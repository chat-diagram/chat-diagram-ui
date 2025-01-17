import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function downloadSvgAsPng(
  svgElement: HTMLElement,
  filename = "image.png"
) {
  try {
    // 获取 SVG 的尺寸
    const svgRect = svgElement.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      // message.error(t("diagram.canvasError"));
      return;
    }

    // 设置 canvas 尺寸
    canvas.width = svgRect.width;
    canvas.height = svgRect.height;

    // 优化 SVG 数据处理
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const ImagBase64 = `data:image/svg+xml;base64,${window.btoa(
      unescape(encodeURIComponent(svgData))
    )}`;
    const url = ImagBase64;

    const img = new Image();
    img.crossOrigin = "anonymous"; // 添加跨域支持
    img.setAttribute("crossOrigin", "anonymous");

    img.src = url;
    img.onload = () => {
      try {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const pngUrl = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.download = filename;
        link.href = pngUrl;
        link.click();
        URL.revokeObjectURL(url); // 清理 URL
      } catch (error) {
        console.error("PNG导出失败:", error);
        // message.error(t("diagram.exportError"));
      }
    };

    img.onerror = (error) => {
      console.error("SVG加载失败:", error);
      // message.error(t("diagram.svgLoadError"));
      URL.revokeObjectURL(url);
    };
  } catch (error) {
    console.error("下载过程出错:", error);
    // message.error(t("diagram.downloadError"));
  }
}
