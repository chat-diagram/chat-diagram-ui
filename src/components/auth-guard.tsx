"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const publicPaths = ["/login", "/signup"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const isShare = searchParams.get("share");
    const isPublicPath = publicPaths.includes(pathname || "") || isShare;
    if (!token && !isPublicPath) {
      router.push("/login");
    } else if (token && isPublicPath) {
      debugger;

      router.push("/");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
