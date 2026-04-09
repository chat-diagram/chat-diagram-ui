import { Avatar } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useDeleteDiagram } from "@/hooks/use-diagrams";
import { useI18n } from "@/i18n";
import { Diagram } from "@/lib/api/diagrams";
import { useAppStore } from "@/store/app";
import { useDiagramsStore } from "@/store/diagrams";
import dayjs from "@/lib/utils/dayjs";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import MermaidDiagram from "@/components/mermaid/beautiful-mermaid-diagram";
export const DiagramItem = ({ diagram }: { diagram: Diagram }) => {
  const t = useI18n();

  const params = useParams();
  const projectId = params.id;
  const { user } = useAppStore();
  const { mutate: deleteDiagram } = useDeleteDiagram(projectId as string);

  const { setRenameDiagramDialogOpen } = useDiagramsStore();

  return (
    <Card className="flex flex-col px-4 py-2 space-y-2 " key={diagram.id}>
      <Link href={`/chat/${diagram.id}`} className="flex flex-col gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-medium">{diagram.title}</h2>
            <p className="text-gray-400 truncate text-sm">
              {diagram.description}
            </p>
            <div className="w-full h-full ">
              <MermaidDiagram code={diagram.mermaidCode} height={200} />
            </div>
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
                {t("editBtn")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  deleteDiagram(diagram.id);
                }}
                className="text-red-500 focus:bg-red-100 focus:text-red-500"
              >
                {t("deleteBtn")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Link>
    </Card>
  );
};
