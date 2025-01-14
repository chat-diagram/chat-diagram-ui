"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const publicPaths = ["/login", "/signup"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isPublicPath = publicPaths.includes(pathname || "");
    if (!token && !isPublicPath) {
      router.push("/login");
    } else if (token && isPublicPath) {
      debugger;

      router.push("/");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
