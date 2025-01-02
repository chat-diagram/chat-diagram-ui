"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { LocalIcons } from "./local-icons";

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
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 ">
            <LocalIcons.SystemLogo />
            {open && (
              <span className="text-lg font-bold whitespace-nowrap">
                chat-diagram
              </span>
            )}
          </div>
          {open && <SidebarTrigger className="-ml-1" />}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
