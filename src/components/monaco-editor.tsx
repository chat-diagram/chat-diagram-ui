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
  useEffect(() => {
    if (editorRef.current) {
      const currentTheme = nextTheme === "dark" ? "vs-dark" : "light";
      editorRef.current.updateOptions({ theme: currentTheme });
    }
  }, [nextTheme]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    // 设置一些编辑器选项
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      tabSize: 2,
      theme: nextTheme === "dark" ? "vs-dark" : "light",
    });
    initEditor(monaco);
    console.log("lei1");
    onMount(editor, monaco);
    console.log("lei2");
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
