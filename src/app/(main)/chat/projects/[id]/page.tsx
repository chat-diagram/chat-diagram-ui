"use client";

import { CustomSender } from "@/components/sender";
import { Separator } from "@/components/ui/separator";
import { useGetDiagramsByProjectId } from "@/hooks/use-diagrams";
import { useSender } from "@/hooks/use-sender";
import { Project, projectsApi } from "@/lib/api/projects";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DiagramList } from "../../../../../components/diagram/diagram-list";
import ProjectsHeader from "./components/projects-header";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id;

  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!projectId || typeof projectId !== "string") return;

    const controller = new AbortController();

    projectsApi
      .getProject(projectId, controller.signal)
      .then(setProject)
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });

    return () => controller.abort();
  }, [projectId]);

  const { content, setContent, loading, setLoading, enhanceDescription } =
    useSender();

  const { data: diagrams = [] } = useGetDiagramsByProjectId(
    projectId as string
  );

  const onSenderSubmit = async () => {
    router.push(
      `/chat/new?pid=${projectId}&d=${content}&title=${project?.name}`
    );
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <ProjectsHeader project={project} />
        <Separator />
        <div className="px-4 space-y-2 py-4">
          <CustomSender
            content={content}
            onEnhance={() => enhanceDescription(content)}
            onSubmit={() => onSenderSubmit()}
            setContent={setContent}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
        <Separator />
        <DiagramList diagrams={diagrams} />
      </div>
    </div>
  );
}
