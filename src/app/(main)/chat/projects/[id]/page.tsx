"use client";

import { CustomSender } from "@/components/sender";
import dayjs from "@/lib/utils/dayjs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  useDeleteDiagram,
  useGetDiagramsByProjectId,
} from "@/hooks/use-diagrams";
import { useSender } from "@/hooks/use-sender";
import { diagramsApi } from "@/lib/api/diagrams";
import { Project, projectsApi } from "@/lib/api/projects";
import { MoreHorizontal, Shuffle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/app";
import { Avatar } from "@/components/avatar";
import { useDiagramsStore } from "@/store/diagrams";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id;

  const [project, setProject] = useState<Project | null>(null);

  const getProject = async () => {
    if (!projectId) {
      return;
    }
    const project = await projectsApi.getProject(projectId as string);
    setProject(project);
  };

  useEffect(() => {
    getProject();
  }, [projectId]);

  const { content, setContent, loading, setLoading, enhanceDescription } =
    useSender();

  const { data: diagrams } = useGetDiagramsByProjectId(projectId as string);
  console.log("diagrams", diagrams);

  const onSenderSubmit = async () => {
    router.push(
      `/chat/new?pid=${projectId}&d=${content}&title=${project?.name}`
    );
  };
  const { user } = useAppStore();

  const { mutate: deleteDiagram } = useDeleteDiagram(projectId as string);

  const { setRenameDiagramDialogOpen } = useDiagramsStore();

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <header className="px-4 flex justify-between items-center h-12">
          {/* <h1 className="text-sm font-medium">项目详情 #{projectId}</h1> */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/chat/projects">Projects</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{project?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <Separator />
        {/* <div className="px-4 py-4">
          <h1 className="font-medium">{project?.name}</h1>
          <p className="text-sm text-muted-foreground">
            {project?.description || "no description"}
          </p>
        </div>
        <Separator /> */}

        <div className="px-4 space-y-2 py-4">
          <CustomSender
            content={content}
            onEnhance={() =>
              enhanceDescription(content, (content: string) => {
                console.log("onEnhance", content);
                // setContent(content);
              })
            }
            onSubmit={() => onSenderSubmit()}
            setContent={setContent}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
        <Separator />
        <div className="px-4 space-y-2 py-4">
          {diagrams?.length ? (
            diagrams?.map((diagram) => (
              <Card
                className="flex flex-col px-4 py-2 space-y-2 "
                key={diagram.id}
              >
                <Link
                  href={`/chat/${diagram.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-3">
                    {/* <div className="p-2 bg-zinc-200 rounded-lg">
                      <Shuffle className="h-5 w-5 text-gray-400" />
                    </div> */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-medium">{diagram.title}</h2>
                      <p className="text-gray-400 truncate text-sm">
                        {/* 0 {project.chatCount} Chat{project.chatCount !== 1 && "s"} */}
                        {diagram.description}
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
                        {/* Updated  */}
                        {dayjs(diagram.updatedAt).fromNow()}
                      </span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            setRenameDiagramDialogOpen(true, diagram);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            deleteDiagram(diagram.id);
                            //   deleteProject(project.id);
                          }}
                          className="text-red-500 focus:bg-red-100 focus:text-red-500"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Link>
              </Card>
            ))
          ) : (
            <Card
              className="flex flex-col justify-center items-center h-96"
              style={{ height: "600px" }}
            >
              <div>No Diagrams</div>
              <div className="text-sm text-muted-foreground">
                To get started, create a new chat in this project.{" "}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* 在这里添加项目详情的内容 */}
    </div>
  );
}
