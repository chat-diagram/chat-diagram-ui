"use client";
import * as React from "react";
import { nanoid } from "nanoid";
import { FolderClosed, Frame, Map, PieChart } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { SystemLogo } from "@/components/system-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useProjectsStore } from "@/store/projects";
import { useAppStore } from "@/store/app";
import { useGetProjects } from "@/hooks/use-projects";
// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentPath = usePathname();
  const { setAddProjectDialogOpen } = useProjectsStore();
  const { user } = useAppStore();

  const { data: projects = [], isLoading, error } = useGetProjects();

  const data = {
    // user: {
    //   name: "shadcn",
    //   email: "m@example.com",
    //   avatar: "/avatars/shadcn.jpg",
    // },

    // teams: [
    //   {
    //     name: "Acme Inc",
    //     logo: GalleryVerticalEnd,
    //     plan: "Enterprise",
    //   },
    //   {
    //     name: "Acme Corp.",
    //     logo: AudioWaveform,
    //     plan: "Startup",
    //   },
    //   {
    //     name: "Evil Corp.",
    //     logo: Command,
    //     plan: "Free",
    //   },
    // ],
    navMain: [
      // {
      //   title: "Playground",
      //   url: "#",
      //   icon: SquareTerminal,
      //   isActive: true,
      //   items: [
      //     {
      //       title: "History",
      //       url: "#",
      //     },
      //     {
      //       title: "Starred",
      //       url: "#",
      //     },
      //     {
      //       title: "Settings",
      //       url: "#",
      //     },
      //   ],
      // },
      // {
      //   title: "Models",
      //   url: "#",
      //   icon: Bot,
      //   items: [
      //     {
      //       title: "Genesis",
      //       url: "#",
      //     },
      //     {
      //       title: "Explorer",
      //       url: "#",
      //     },
      //     {
      //       title: "Quantum",
      //       url: "#",
      //     },
      //   ],
      // },
      //
      {
        title: "Projects",
        url: "/chat/projects",
        icon: FolderClosed,
        isActive: currentPath === "/chat/projects",
        onExtraClick: () => {
          setAddProjectDialogOpen(true);
        },
        // items: [
        //   {
        //     title: "General",
        //     url: "#",
        //   },
        //   {
        //     title: "Team",
        //     url: "#",
        //   },
        //   {
        //     title: "Billing",
        //     url: "#",
        //   },
        //   {
        //     title: "Limits",
        //     url: "#",
        //   },
        // ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

  const defaultConversationsItems = [
    {
      key: nanoid(),
      label: "New Conversation",
    },
  ];
  const [conversationsItems, setConversationsItems] = React.useState(
    defaultConversationsItems
  );

  const handleAddConversation = () => {
    setConversationsItems([
      ...conversationsItems,
      {
        key: nanoid(),
        label: `New Conversation ${conversationsItems.length}`,
      },
    ]);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <SystemLogo />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* <NavAddConversation
          conversationsItems={conversationsItems}
          onAddConversation={handleAddConversation}
        /> */}
        <NavMain items={data.navMain} />
        <NavProjects projects={projects} />
        {/* <NavConversations conversationsItems={conversationsItems} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user!} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
