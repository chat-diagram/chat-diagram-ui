"use client";

import {
  ChevronRight,
  Folder,
  Forward,
  MoreHorizontal,
  Plus,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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
  const isMobile = useIsMobile();

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
                  <p>Add a new project</p>
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
