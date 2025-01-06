const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60, // 1分钟
      refetchOnWindowFocus: false,
    },
  },
});

// interface ApiResponse<T = unknown> {
//   code: number;
//   data: T;
//   message: string;
// }
// interface ApiResponse<T = unknown> {
//   code: number;
//   data: T;
//   message: string;
// }

type ApiResponse<T = unknown> = T & { statusCode: number; message: string };

export const request = {
  async fetch<T>(
    endpoint: string,
    config: RequestInit,
    onStream?: (data: T) => void
  ): Promise<T | Response> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...config,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        ...config.headers,
      },
    });
    debugger;

    // debugger;

    debugger;
    // 检查是否为流式响应
    const isStream = response.headers.get("content-type")?.includes("stream");

    if (isStream) {
      debugger;
      return response; // 对于流式请求直接返回 response
    }
    const data: ApiResponse<T> = await response.json();

    if (data.statusCode === 401) {
      localStorage.removeItem("token");

      window.location.href = "/login";
    }

    if (!response.ok) {
      throw new Error("请求失败");
    }
    return data;
  },

  get<T>(endpoint: string, config?: RequestInit) {
    return this.fetch<T>(endpoint, { ...config, method: "GET" });
  },

  post<T>(endpoint: string, body?: unknown, config?: RequestInit) {
    return this.fetch<T>(endpoint, {
      ...config,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  // async fetchStream(
  //   endpoint: string,
  //   config: RequestInit
  // ): Promise<ReadableStream> {
  //   const response = await fetch(`${BASE_URL}${endpoint}`, {
  //     ...config,
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       ...config.headers,
  //     },
  //   });

  //   if (response.status === 401) {
  //     localStorage.removeItem("token");
  //     window.location.href = "/login";
  //   }

  //   if (!response.ok) {
  //     throw new Error("请求失败");
  //   }

  //   if (!response.body) {
  //     throw new Error("没有响应数据");
  //   }

  //   return response.body;
  // },

  // postStream(endpoint: string, body?: unknown, config?: RequestInit) {
  //   return this.fetchStream(endpoint, {
  //     ...config,
  //     method: "POST",
  //     body: JSON.stringify(body),
  //   });
  // },
};
