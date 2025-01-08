"use client";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@/components/Avatar";
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
import { MoreHorizontal, Search, Shuffle } from "lucide-react";
import { Project, projectsApi } from "@/lib/api/projects";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/app";
import { useDeleteProject, useGetProjects } from "@/hooks/use-projects";

export default function ChatProjectsPage() {
  const { addProjectDialogOpen, setAddProjectDialogOpen } = useProjectsStore();
  const { user } = useAppStore();

  //   const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  // 新增获取projects的函数
  //   const fetchProjects = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await projectsApi.getProjectsList();
  //       setProjects(response);
  //     } catch (error) {
  //       console.error("Failed to fetch projects:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const { data: projects = [], isLoading, error } = useGetProjects();

  //   useEffect(() => {
  //     fetchProjects();
  //   }, []);
  const { mutate: deleteProject } = useDeleteProject();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="bg-bacsakground/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <header className="px-4 flex justify-between items-center h-12">
          <h1 className="text-sm font-medium">Projects</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAddProjectDialogOpen(true)}
          >
            New Project
          </Button>
        </header>
        <Separator />
        <div className="flex items-center gap-0 px-4 h-[50px]">
          <Search size={16} />
          <Input
            className="border-0 rounded-none outline-none focus-visible:ring-0 shadow-none"
            placeholder="Search your projects"
          ></Input>
        </div>
        <Separator />
      </div>

      <div className="overflow-y-auto gap-4 py-4 w-full flex-col flex flex-1 z-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 px-4 w-full mx-auto">
          {projects.map((project) => (
            <Link href={`/chat/projects/${project.id}`} key={project.id}>
              <Card key={project.id} className="p-3 space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-zinc-200 rounded-lg">
                    <Shuffle className="h-5 w-5 text-gray-400" />
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
                      Updated {dayjs(project.updatedAt).fromNow()}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          deleteProject(project.id);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      {/* <Dialog
        open={addProjectDialogOpen}
        onOpenChange={onAddProjectDialogOpenChange}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a new project</DialogTitle>
          </DialogHeader>
          <Form {...addProjectForm}>
            <form
              onSubmit={addProjectForm.handleSubmit(handleAddProjectSubmit)}
              className="space-y-6"
            >
              <FormField
                control={addProjectForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="This is a project name"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={addProjectForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="This is a description"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setAddProjectDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
