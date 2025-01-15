"use client";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import dayjs from "@/lib/utils/dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useProjectsStore } from "@/store/projects";
import { ChartNoAxesGantt, MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/app";
import { useDeleteProject, useGetProjects } from "@/hooks/use-projects";
import { useI18n } from "@/i18n";

export default function ChatProjectsPage() {
  const t = useI18n();

  const { setAddProjectDialogOpen } = useProjectsStore();
  const { user } = useAppStore();

  const { data: projects = [] } = useGetProjects();
  const { mutate: deleteProject } = useDeleteProject();

  const [search, setSearch] = useState("");
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="bg-bacsakground/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <header className="px-4 flex justify-between items-center h-12">
          <h1 className="text-sm font-medium">{t("project.title")}</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddProjectDialogOpen(true)}
          >
            {t("project.addBtn")}
          </Button>
        </header>
        <Separator />
        <div className="flex items-center gap-0 px-4 h-[50px]">
          <Search size={16} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 rounded-none outline-none focus-visible:ring-0 shadow-none"
            placeholder={t("project.searchPlaceholder")}
          ></Input>
        </div>
        <Separator />
        {projects.length === 0 && (
          <div className="px-4 space-y-2 py-4">
            <Card
              className="flex flex-col justify-center items-center h-96"
              style={{ height: "600px" }}
            >
              <div>{t("project.searchEmptyTitle")}</div>
              <div className="text-sm text-muted-foreground">
                {t("project.searchEmptyDesc")}
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="overflow-y-auto gap-4 py-4 w-full flex-col flex flex-1 z-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 px-4 w-full mx-auto">
          {filteredProjects.map((project) => (
            <Link href={`/chat/projects/${project.id}`} key={project.id}>
              <Card key={project.id} className="p-3 space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-zinc-200 rounded-lg dark:bg-zinc-800">
                    <ChartNoAxesGantt />
                    {/* <Shuffle className="h-5 w-5 text-gray-400" /> */}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-medium">{project.name}</h2>
                    <p className="text-gray-400">
                      {/* 0 {project.chatCount} Chat{project.chatCount !== 1 && "s"} */}
                    </p>
                  </div>
                </div>

                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Avatar name={user?.username || ""} size="sm" />
                    <span className="text-sm text-foreground truncate">
                      {user?.username}
                    </span>
                    <span className="text-sm text-gray-400 whitespace-nowrap">
                      {dayjs(project.updatedAt).fromNow()}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>{t("editBtn")}</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          deleteProject(project.id);
                        }}
                        className="text-red-500 focus:bg-red-100 focus:text-red-500"
                      >
                        {t("deleteBtn")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
