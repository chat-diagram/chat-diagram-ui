import { AuthGuard } from "@/components/auth-guard";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/components/theme-providers";

import "@ant-design/v5-patch-for-react-19";

import "./(main)/globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};
// 根布局只包含最基础的配置
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthGuard>{children}</AuthGuard>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
