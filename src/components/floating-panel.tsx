"use client";
import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquareText, Minimize2 } from "lucide-react";

// 面板的初始配置
const initialState = {
  width: 380,
  height: 500,
  x: 0, // 默认靠左
  y: window.innerHeight - 520, // 默认靠下
};

const FloatingInspectPanel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 管理面板的位置和尺寸
  const [panelState, setPanelState] = useState(initialState);
  // 管理当前是显示面板还是悬浮按钮
  const [isMinimized, setIsMinimized] = useState(false);

  // 按钮的动画变体 (Framer Motion)
  const buttonVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
    exit: { scale: 0, opacity: 0 },
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isMinimized ? (
          // ==========================================
          // 1. 悬浮按钮模式 (FAB)
          // ==========================================
          <motion.button
            key="fab"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            // 将按钮也定位在 absolute，通常固定在右下角
            className="fixed bottom-10 right-10 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl transition-all hover:bg-blue-700 active:scale-95 group"
            onClick={() => setIsMinimized(false)}
          >
            <MessageSquareText size={24} />
            {/* 鼠标悬浮时的气泡提示 */}
            <span className="absolute right-16 scale-0 rounded bg-slate-800 px-3 py-1.5 text-xs text-white group-hover:scale-100 transition-all whitespace-nowrap">
              打开AI Chat
            </span>
          </motion.button>
        ) : (
          // ==========================================
          // 2. 悬浮面板模式 (Rnd)
          // ==========================================
          <Rnd
            key="panel"
            // 绑定位置和尺寸状态
            size={{ width: panelState.width, height: panelState.height }}
            position={{ x: panelState.x, y: panelState.y }}
            // 监听状态改变
            onDragStop={(e, d) =>
              setPanelState((prev) => ({ ...prev, x: d.x, y: d.y }))
            }
            onResizeStop={(e, direction, ref, delta, position) => {
              setPanelState({
                width: parseInt(ref.style.width, 10),
                height: parseInt(ref.style.height, 10),
                ...position,
              });
            }}
            // Rnd 配置
            minWidth={280}
            minHeight={300}
            maxWidth={800}
            maxHeight={window.innerHeight - 100}
            bounds="window" // 限制不能拖出窗口
            dragHandleClassName="handle" // 指定只有头部可以拖拽
            enableResizing={{ bottomRight: true }} // 只允许右下角缩放（更符合习惯）
            className="z-50" // 确保在最上层
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-sm shadow-2xl dark:border-slate-700 dark:bg-slate-900/95"
            >
              {/* --- 头部 (可拖拽区域) --- */}
              <div className="handle flex cursor-grab items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3 dark:border-slate-800 dark:bg-slate-800/50 active:cursor-grabbing">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    AI Chat
                  </span>
                </div>
                {/* 顶部操作按钮 */}
                <div className="flex items-center gap-1.5 text-slate-400">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1 rounded-md hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700"
                  >
                    <Minimize2 size={16} />
                  </button>
                </div>
              </div>

              {/* --- 内容区域 --- */}
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                {children}
              </div>

              {/* --- 底部 (可选，可作为状态栏或缩放手柄指示) --- */}
              <div className="flex justify-end p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                {/* 右下角的缩放手柄图标 */}
                <div className="h-3 w-3 border-r-2 border-b-2 border-slate-300 dark:border-slate-600 rounded-br cursor-se-resize" />
              </div>
            </motion.div>
          </Rnd>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingInspectPanel;
