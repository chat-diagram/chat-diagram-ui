import { Card } from "@/components/ui/card";
import { GetDiagramListByProjectIdResponse } from "@/lib/api/diagrams";
import { DiagramItem } from "./diagram-item";

export const DiagramList = ({
  diagrams,
}: {
  diagrams: GetDiagramListByProjectIdResponse;
}) => {
  return (
    <div className="px-4 space-y-2 py-4">
      {diagrams?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {diagrams?.map((diagram) => (
            <DiagramItem key={diagram.id} diagram={diagram} />
          ))}
        </div>
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
  );
};
