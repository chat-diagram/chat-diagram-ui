"use client";
import MonacoEditor from "@/components/monaco-editor";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import mermaid from "mermaid";
import { useEffect, useState } from "react";
import { useChatContext } from "../layout";
const LiveEditor = () => {
  const [activeTab, setActiveTab] = useState("preview");
  // 初始化 mermaid
  // 添加状态来存储 mermaid 图表内容
  const [mermaidContent, setMermaidContent] = useState("");
  //   const [lastSuccessfulContent, setLastSuccessfulContent] = useState(""); // 最后一次成功的内容

  const [isError, setIsError] = useState(false);

  const renderMermaid = async (code: string) => {
    if (!code.trim()) return;

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
    console.log("handleCodeChange", value);
    setMermaidCode(value);
    renderMermaid(value);
  };

  useEffect(() => {
    // 在组件挂载后初始化 mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
    });
    console.log("mermaid初始化完成");

    if (mermaidCode) {
      renderMermaid(mermaidCode);
    }
  }, []); // 空依赖数组确保只在挂载时执行一次

  const { mermaidCode, setMermaidCode } = useChatContext();
  // useEffect(() => {
  //   console.log("useEffect mermaidCode", mermaidCode);
  // }, [mermaidCode]);
  useEffect(() => {
    renderMermaid(mermaidCode);
  }, [mermaidCode]);
  const handleEditorDidMount = () =>
    // editor: editor.IStandaloneCodeEditor,
    // monaco: Monaco
    {
      console.log("编辑器挂载完毕，设置值", mermaidCode);
      console.log("mermaidContent", mermaidContent);
      if (mermaidCode) {
        renderMermaid(mermaidCode);
      }
      // setMermaidCode(mermaidCode);
      // renderMermaid(mermaidCode);
    };
  // };

  return (
    <div className="w-full flex flex-col h-screen">
      <div className="w-full p-1 border-b border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="preview">预览</TabsTrigger>
            <TabsTrigger value="code">代码</TabsTrigger>
          </TabsList>
        </Tabs>
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
