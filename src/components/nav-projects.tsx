"use client";

import {
  ChartNoAxesGantt,
  Circle,
  Folder,
  Forward,
  Icon,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useDeleteProject, useGetProjects } from "@/hooks/use-projects";
import { Project } from "@/lib/api/projects";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export function NavProjects({ projects }: { projects: Project[] }) {
  const router = useRouter();

  const { isMobile } = useSidebar();

  const visibleCount = 3;
  const hasMoreProjects = projects.length > visibleCount;
  const visibleProjects = projects.slice(0, visibleCount);
  const currentPath = usePathname();

  const { mutate: deleteProject } = useDeleteProject();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {visibleProjects.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              asChild
              isActive={currentPath === `/chat/projects/${item.id}`}
            >
              <Link href={`/chat/projects/${item.id}`}>
                {/* <item.name /> */}
                <ChartNoAxesGantt />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem
                  onClick={() => {
                    router.push(`/chat/projects/${item.id}`);
                  }}
                >
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => deleteProject(item.id)}
                  className="text-red-500 focus:bg-red-100 focus:text-red-500"
                >
                  <Trash2 />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {hasMoreProjects && (
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-sidebar-foreground/70">
              <Link href="/chat/projects">
                <MoreHorizontal className="text-sidebar-foreground/70" />
                <span>More</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
