import { renderMermaidSVG, RenderOptions } from "beautiful-mermaid";
import { useMemo } from "react";

export default function MermaidDiagram({
  code,
  height,
  renderOptions,
}: {
  code: string;
  height?: number;
  renderOptions?: RenderOptions;
}) {
  code = code.replace(/^```mermaid\n/, "").replace(/\n```$/, "");
  const { svg, error } = useMemo(() => {
    try {
      return {
        svg: renderMermaidSVG(code, {
          bg: "transparent",
          interactive: true,
          ...renderOptions,
        }),
        error: null,
      };
    } catch (err) {
      return {
        svg: null,
        error: err instanceof Error ? err : new Error(String(err)),
      };
    }
  }, [code, renderOptions]);

  if (error) return <pre>{error.message}</pre>;
  const styledSvg = svg.replace(/<svg\b([^>]*)>/i, (_, attrs) => {
    const cleaned = attrs.replace(
      /\s+(width|height||preserveAspectRatio)="[^"]*"/gi,
      ""
    );
    return `<svg${cleaned} preserveAspectRatio="xMidYMid meet">`;
  });
  return (
    <div
      className={`w-full h-full flex overflow-hidden justify-center`}
      style={{ height: height ? `${height}px` : "100%" }}
      dangerouslySetInnerHTML={{ __html: styledSvg! }}
    />
  );
}
