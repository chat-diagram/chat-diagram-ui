import { diagramsApi } from "@/lib/api/diagrams";
import { queryClient } from "@/lib/request";
import { useMutation, useQuery } from "@tanstack/react-query";
import { message } from "antd";

export function useCreateDiagram(projectId: string) {
  return useMutation({
    mutationFn: diagramsApi.createDiagram,
    onSuccess: () => {
      message.success("Diagram created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["diagrams-project", projectId],
      });
    },
  });
}

export function useGetDiagramsByProjectId(projectId: string) {
  return useQuery({
    queryKey: ["diagrams-project", projectId],
    queryFn: () => diagramsApi.getDiagramsByProjectId(projectId),
  });
}

export function useGetDiagram(diagramId: string) {
  return useQuery({
    queryKey: ["diagram", diagramId],
    queryFn: () => {
      if (diagramId === "new") {
        return null;
      }
      return diagramsApi.getDiagram(diagramId);
    },
  });
}

export function useDeleteDiagram(projectId: string) {
  return useMutation({
    mutationFn: diagramsApi.deleteDiagram,
    onSuccess: () => {
      message.success("Diagram deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["diagrams-project", projectId],
      });
    },
  });
}

export function useRenameDiagram() {
  return useMutation({
    mutationFn: ({
      diagramId,
      data,
      projectId,
    }: {
      diagramId: string;
      data: { title: string };
      projectId: string;
    }) => diagramsApi.renameDiagram(diagramId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["diagrams-project", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["diagram", variables.diagramId],
      });
    },
  });
}
