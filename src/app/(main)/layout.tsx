"use client";
// import type { Metadata } from "next";
import { AppSidebar } from "@/components/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AddProjectDialog } from "@/components/add-project-dialog";
import { RenameDiagramDialog } from "@/components/rename-diagram-dialog";
import { useSearchParams } from "next/navigation";
// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function Page({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const share = searchParams.get("share");
  return (
    <SidebarProvider>
      {!share && <AppSidebar />}

      <SidebarInset>{children}</SidebarInset>
      <AddProjectDialog />
      <RenameDiagramDialog />
    </SidebarProvider>
  );
}
