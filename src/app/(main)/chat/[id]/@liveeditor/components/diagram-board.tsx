import React, { useState, useRef, useCallback, useEffect } from "react";
import { SvgContainer } from "./svg-container";
import { useChatContext } from "../../layout";

function DiagramBoard({ svgContent }: { svgContent: string }) {
  const { selected, setSelected } = useChatContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selBox, setSelBox] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  // 缩放和平移状态
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 5;

  // 滚轮缩放 + 触控板双指平移/捏合
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    // ctrlKey=true 表示 pinch 手势或 Ctrl+滚轮 → 缩放
    if (e.ctrlKey) {
      const delta = e.deltaY > 0 ? 0.98 : 1.02;
      setTransform((prev) => {
        if (!containerRef.current) return prev;
        const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * delta));
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        return {
          scale: newScale,
          x: mouseX - (mouseX - prev.x) * (newScale / prev.scale),
          y: mouseY - (mouseY - prev.y) * (newScale / prev.scale),
        };
      });
    } else {
      // 双指滑动 → 平移（deltaX/deltaY 单位已是像素）
      setTransform((prev) => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  }, []);

  // 绑定 wheel 事件（需要 passive: false）
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // 中键拖拽平移
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 中键或空格+左键 → 平移
    if (e.button === 1) {
      e.preventDefault();
      isPanning.current = true;
      panStart.current = {
        x: e.clientX - transform.x,
        y: e.clientY - transform.y,
      };
      return;
    }
    // 左键点在节点上 → 不框选
    if ((e.target as Element).closest(".node")) return;
    // 左键框选
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    startPos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setSelBox({ x: startPos.current.x, y: startPos.current.y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // 平移
    if (isPanning.current) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - panStart.current.x,
        y: e.clientY - panStart.current.y,
      }));
      return;
    }
    // 框选
    if (!startPos.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    setSelBox({
      x: Math.min(startPos.current.x, curX),
      y: Math.min(startPos.current.y, curY),
      w: Math.abs(curX - startPos.current.x),
      h: Math.abs(curY - startPos.current.y),
    });
  };

  const handleMouseUp = () => {
    if (isPanning.current) {
      isPanning.current = false;
      return;
    }
    if (!selBox || !containerRef.current) {
      startPos.current = null;
      setSelBox(null);
      return;
    }
    const container = containerRef.current;
    const nodes = container.querySelectorAll(".node");
    const hits = new Set<string>();
    nodes.forEach((node) => {
      const r = node.getBoundingClientRect();
      const cr = container.getBoundingClientRect();
      const nodeRect = {
        x: r.left - cr.left,
        y: r.top - cr.top,
        w: r.width,
        h: r.height,
      };
      if (
        nodeRect.x < selBox.x + selBox.w &&
        nodeRect.x + nodeRect.w > selBox.x &&
        nodeRect.y < selBox.y + selBox.h &&
        nodeRect.y + nodeRect.h > selBox.y
      ) {
        hits.add(node.id);
      }
    });
    setSelected(hits);
    startPos.current = null;
    setSelBox(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const node = (e.target as Element).closest(".node");
    if (!node) {
      setSelected(new Set());
      return;
    }
    const id = node.id;
    setSelected((prev) => {
      const next = new Set(prev);
      if (e.shiftKey) {
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
      } else {
        return new Set([id]);
      }
      return next;
    });
  };

  // 以容器中心为基准缩放
  const zoomAtCenter = (factor: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    setTransform((prev) => {
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev.scale * factor));
      return {
        scale: newScale,
        x: cx - (cx - prev.x) * (newScale / prev.scale),
        y: cy - (cy - prev.y) * (newScale / prev.scale),
      };
    });
  };

  // 缩放控制按钮
  const zoomIn = () => zoomAtCenter(1.1);
  const zoomOut = () => zoomAtCenter(1 / 1.1);
  const resetView = () => setTransform({ x: 0, y: 0, scale: 1 });

  // 高亮选中节点
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.querySelectorAll(".node").forEach((node) => {
      node.classList.toggle("selected", selected.has(node.id));
    });
  }, [selected]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* 点阵背景 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          //   backgroundImage: `radial-gradient(circle, #d1d5db ${
          //     1 * transform.scale
          //   }px, transparent ${1 * transform.scale}px)`,
          //   backgroundSize: `${20 * transform.scale}px ${20 * transform.scale}px`,
          //   backgroundPosition: `${transform.x}px ${transform.y}px`,
          pointerEvents: "none",
        }}
      />

      {/* 画布主体 */}
      <div
        ref={containerRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          width: "100%",
          height: "100%",
          cursor: isPanning.current ? "grabbing" : "default",
          userSelect: "none",
        }}
      >
        <div
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: "0 0",
            willChange: "transform",
          }}
        >
          <SvgContainer svgContent={svgContent} />
        </div>
      </div>

      {/* 框选矩形 */}
      {selBox && (
        <div
          style={{
            position: "absolute",
            left: selBox.x,
            top: selBox.y,
            width: selBox.w,
            height: selBox.h,
            border: "1px dashed #4f46e5",
            background: "rgba(79,70,229,0.1)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* 缩放控制栏 */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          background: "white",
          borderRadius: 8,
          padding: "6px 12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          alignItems: "center",
        }}
      >
        <button onClick={zoomOut} style={btnStyle}>
          −
        </button>
        <span style={{ fontSize: 13, minWidth: 48, textAlign: "center" }}>
          {Math.round(transform.scale * 100)}%
        </span>
        <button onClick={zoomIn} style={btnStyle}>
          +
        </button>
        <div style={{ width: 1, height: 20, background: "#e5e7eb" }} />
        <button onClick={resetView} style={btnStyle}>
          ↺
        </button>
      </div>
    </div>
  );
}

const btnStyle = {
  width: 32,
  height: 32,
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  background: "white",
  cursor: "pointer",
  fontSize: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export default DiagramBoard;
