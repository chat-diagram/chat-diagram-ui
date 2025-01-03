"use client";
import MonacoEditor from "@/components/monaco-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import mermaid from "mermaid";
import { useEffect, useState } from "react";
import { useChatContext } from "../layout";
const LiveEditor = () => {
  const [activeTab, setActiveTab] = useState("preview");
  const [code, setCode] = useState("");
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
      console.log("render");
      const result = await mermaid.render("mermaid-preview", code);
      //   const result = await mermaid.render("mermaid-preview", code);
      console.log("result", result);
      setMermaidContent(result.svg);
      setIsError(false);
    } catch (error) {
      console.error("Mermaid 渲染错误:", error);
      setIsError(true);
      // 发生错误时不更新 mermaidContent，保留上次的正确结果
    }
  };

  const handleCodeChange = (value: string) => {
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
  }, []); // 空依赖数组确保只在挂载时执行一次

  const { mermaidCode, setMermaidCode } = useChatContext();
  return (
    <div className="w-full h-screen">
      <div className="w-full p-1 border-b border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="preview">预览</TabsTrigger>
            <TabsTrigger value="code">代码</TabsTrigger>
          </TabsList>
          {/* <TabsContent value="preview"></TabsContent>
          <TabsContent value="code">
            <div className="w-full h-full">
              <textarea
                className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none"
                placeholder="在此输入 Mermaid 语法..."
                onChange={(e) => {
                  const code = e.target.value;
                  // 重新渲染图表
                  mermaid.render("mermaid-preview", code).then((result) => {
                    document.getElementById("mermaid-preview")!.innerHTML =
                      result.svg;
                  });
                }}
              />
            </div>
          </TabsContent> */}
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
        />
      </div>
      <div className={`${activeTab === "preview" ? "block" : "hidden"}`}>
        <div
          className={`w-full h-full p-4 ${isError ? "opacity-50" : ""}`}
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

// LiveEditor.displayName = "LiveEditor";

export default LiveEditor;
