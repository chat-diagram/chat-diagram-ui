"use client";

import { Plus, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useI18n } from "@/i18n";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    onExtraClick: () => void;

    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const t = useI18n();
  // const isMobile = useIsMobile();

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              isActive={item.isActive}
              asChild
              tooltip={item.title}
            >
              <Link href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {/* <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> */}
              </Link>
            </SidebarMenuButton>
            <SidebarMenuAction showOnHover>
              {/* <Button variant="ghost" size="icon"> */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Plus size={16} onClick={() => item.onExtraClick()} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("project.siderBtn.addTooltip")}</p>
                </TooltipContent>
              </Tooltip>

              {/* </Button> */}
              <span className="sr-only">More</span>
            </SidebarMenuAction>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
