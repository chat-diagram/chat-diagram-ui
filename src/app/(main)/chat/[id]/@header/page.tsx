"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useI18n } from "@/i18n";
import { useParams, useSearchParams } from "next/navigation";
import { useGetDiagram } from "@/hooks/use-diagrams";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDiagramsStore } from "@/store/diagrams";
import { useChatContext } from "../layout";

export default function Header() {
  const t = useI18n();

  const { title } = useChatContext();

  const { setRenameDiagramDialogOpen } = useDiagramsStore();
  const handleRenameDiagram = () => {
    setRenameDiagramDialogOpen(true, diagrams);
  };
  const searchParams = useSearchParams();
  const { id } = useParams();

  const queryProjectTitle = searchParams.get("title");

  const isSharePage = searchParams.get("share") === "true";
  const { data: diagramsData } = useGetDiagram(id as string, {
    enabled: !isSharePage,
  });
  // 在需要使用数据的地方进行条件判断
  const diagrams = id !== "new" ? diagramsData : null;
  return (
    <header className="px-4 flex justify-between items-center h-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/chat/projects`}>{t("project.title")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              {queryProjectTitle ? (
                <span>{queryProjectTitle}</span>
              ) : (
                <Link href={`/chat/projects/${diagrams?.projectId}`}>
                  {diagrams?.project?.name}
                </Link>
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {queryProjectTitle ? (
              <span>{title}</span>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <BreadcrumbPage
                    onClick={handleRenameDiagram}
                    className="hover:underline"
                    style={{ cursor: "pointer" }}
                  >
                    {diagrams?.title}
                  </BreadcrumbPage>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("diagram.renameBtnTooltip")}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
