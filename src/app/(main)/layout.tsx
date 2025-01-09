import type { Metadata } from "next";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AddProjectDialog } from "@/components/add-project-dialog";
import { RenameDiagramDialog } from "@/components/rename-diagram-dialog";
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
      <AddProjectDialog />
      <RenameDiagramDialog />
    </SidebarProvider>
  );
}
