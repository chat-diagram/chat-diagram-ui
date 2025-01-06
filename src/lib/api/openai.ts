import { EnhanceStreamRequest, MermaidStreamRequest } from "@/types/openai";
import { request } from "../request";

export const openaiApi = {
  enhanceStream: (description: EnhanceStreamRequest) =>
    request.post("/openai/enhance/stream", description),

  mermaidStream: (description: MermaidStreamRequest) =>
    request.post("/openai/mermaid/stream", description),
};
