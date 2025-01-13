"use client";
import { AuthGuard } from "@/components/auth-guard";
import { QueryProvider } from "@/providers/query-provider";
import "./(main)/globals.css";

import "@ant-design/v5-patch-for-react-19";

// 根布局只包含最基础的配置
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en">
        <body>
          <QueryProvider>
            <AuthGuard>{children}</AuthGuard>
          </QueryProvider>
        </body>
      </html>
    </>
  );
}
