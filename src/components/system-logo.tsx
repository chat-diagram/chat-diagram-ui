"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { LocalIcons } from "./local-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function SystemLogo() {
  const {
    isMobile,
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    toggleSidebar,
  } = useSidebar();
  const router = useRouter();
  return (
    <SidebarMenu style={{ minWidth: "32px" }}>
      <SidebarMenuItem>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 ">
            <LocalIcons.SystemLogo className="w-8 h-8" />
            {open && (
              <span className="text-lg font-bold whitespace-nowrap">
                chat-diagram
              </span>
            )}
          </Link>
          {open && <SidebarTrigger className="-ml-1" />}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
