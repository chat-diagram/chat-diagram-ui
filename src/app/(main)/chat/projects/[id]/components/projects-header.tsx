import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useI18n } from "@/i18n";
import { Project } from "@/lib/api/projects";
import Link from "next/link";

export const ProjectsHeader = ({ project }: { project: Project | null }) => {
  const t = useI18n();
  return (
    <header className="px-4 flex justify-between items-center h-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/chat/projects">{t("project.title")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{project?.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
};
export default ProjectsHeader;
