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

export function useGetDiagram(
  diagramId: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["diagram", diagramId],
    queryFn: () => {
      if (diagramId === "new") {
        return null;
      }
      return diagramsApi.getDiagram(diagramId);
    },
    enabled: options?.enabled !== false, // 默认为 true
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

export function useRollbackDiagramVersion(diagramId: string) {
  return useMutation({
    mutationFn: (version: number) =>
      diagramsApi.rollbackDiagramVersion(diagramId, version),
    onSuccess: () => {
      message.success("Diagram rolled back successfully!");
      queryClient.invalidateQueries({
        queryKey: ["diagram", diagramId],
      });
    },
  });
}

export function useRenameDiagram() {
  return useMutation({
    mutationFn: ({
      diagramId,
      data,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
