"use client";

import { useEffect, useRef } from "react";
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { initEditor } from "@/lib/monacoExtra";
import { useTheme } from "next-themes";

interface MonacoEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  theme?: "vs-dark" | "light";
  height?: string | number;
  onMount: (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => void;
}

const MonacoEditor = ({
  value = "",
  onChange,
  language = "mermaid",
  theme = "vs-dark",
  height = "500px",
  onMount,
}: MonacoEditorProps) => {
  const { theme: nextTheme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // 添加新的 useEffect 来处理主题切换
  let finalTheme = nextTheme;

  useEffect(() => {
    const updateTheme = () => {
      if (nextTheme === "system") {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          finalTheme = "vs-dark";
        } else {
          finalTheme = "light";
        }
      } else {
        finalTheme = nextTheme === "dark" ? "vs-dark" : "light";
      }

      if (editorRef.current) {
        editorRef.current.updateOptions({ theme: finalTheme });
      }
    };

    // 初始化主题
    updateTheme();

    // 创建媒体查询监听器
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const themeChangeHandler = () => updateTheme();

    // 添加系统主题变化的监听
    mediaQuery.addEventListener("change", themeChangeHandler);

    // 清理函数
    return () => {
      mediaQuery.removeEventListener("change", themeChangeHandler);
    };
  }, [nextTheme]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    // 设置一些编辑器选项
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      tabSize: 2,
      theme: finalTheme,
    });
    initEditor(monaco);
    onMount(editor, monaco);
  };

  // 添加 useEffect 监听 value 变化
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      if (editor.getValue() !== value) {
        editor.setValue(value);
      }
    }
  }, [value]);
  return (
    <Editor
      height={height}
      defaultLanguage={language}
      defaultValue={value}
      theme={theme}
      onChange={(value) => onChange?.(value ?? "")}
      onMount={handleEditorDidMount}
      options={{
        automaticLayout: true,
        wordWrap: "on",
        scrollBeyondLastLine: false,
      }}
    />
  );
};

export default MonacoEditor;
