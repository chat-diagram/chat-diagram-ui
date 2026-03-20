import { useRef, useEffect } from "react";
import { useChatContext } from "../../layout";
import { getDslId } from "@/lib/utils/mermaid";

const NODE_SELECTORS = ".node, .actor, .classGroup, .task, .cluster";

export const SvgContainer = ({ svgContent }: { svgContent: string }) => {
  const svgRef = useRef<HTMLDivElement>(null);
  const { selected, setSelected } = useChatContext();

  useEffect(() => {
    if (!svgRef.current || !svgContent) return;
    svgRef.current.innerHTML = svgContent;

    svgRef.current.querySelectorAll(NODE_SELECTORS).forEach((node) => {
      (node as HTMLElement).style.cursor = "pointer";
    });
  }, [svgContent]);

  useEffect(() => {
    const container = svgRef.current;
    if (!container) return;

    const handleClick = (e: Event) => {
      const node = (e.target as HTMLElement).closest(NODE_SELECTORS);
      if (!node) {
        setSelected(new Set());
        return;
      }
      e.stopPropagation();
      // 兼容 id 和 name 属性
      const id = node.id || node.getAttribute("name") || "";
      if (!id) return;
      const dslId = getDslId(id);
      setSelected((prev: Set<string>) => {
        if (!(e as MouseEvent).shiftKey) return new Set([dslId]);
        const next = new Set(prev);
        if (next.has(dslId)) {
          next.delete(dslId);
        } else {
          next.add(dslId);
        }
        return next;
      });
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [setSelected]);

  // 高亮选中节点
  useEffect(() => {
    if (!svgRef.current) return;
    svgRef.current.querySelectorAll(NODE_SELECTORS).forEach((node) => {
      const id = node.id || node.getAttribute("name") || "";
      if (!id) return;
      const dslId = getDslId(id);
      const isSelected = selected.has(dslId);
      node.querySelectorAll("rect, circle, polygon, path").forEach((el) => {
        const svgEl = el as SVGElement;
        svgEl.style.stroke = isSelected ? "#4f46e5" : "";
        svgEl.style.strokeWidth = isSelected ? "2px" : "";
        svgEl.style.filter = isSelected
          ? "drop-shadow(0 0 4px rgba(79,70,229,0.3))"
          : "";
      });
    });
  }, [selected]);

  const handleBgClick = () => setSelected(new Set());

  return (
    <div
      id="svg-container"
      className="justify-center items-center flex"
      ref={svgRef}
      onClick={handleBgClick}
    />
  );
};
