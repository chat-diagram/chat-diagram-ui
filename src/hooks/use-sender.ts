import { openaiApi } from "@/lib/api/openai";
import { useState } from "react";

export const useSender = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const enhanceDescription = async (
    description: string,
    onUpdate?: (content: string) => void
  ) => {
    try {
      setLoading(true);
      if (description.length === 0) return;
      const response = await openaiApi.enhanceStream({ description });
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 解析 SSE 格式数据
        const text = new TextDecoder().decode(value);
        const lines = text.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const jsonData = JSON.parse(line.slice(6));
              if (jsonData.content) {
                fullResponse += jsonData.content;
                // 实时更新UI
                setContent(fullResponse);
                onUpdate(fullResponse);
              }
            } catch (e) {
              // 忽略非JSON格式的行
              continue;
            }
          }
        }
      }
      return fullResponse;
    } catch (error) {
      console.error("增强描述失败:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return { content, setContent, loading, setLoading, enhanceDescription };
};
