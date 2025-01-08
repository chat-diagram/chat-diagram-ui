import { diagramsApi } from "@/lib/api/diagrams";
import { projectsApi } from "@/lib/api/projects";
import { queryClient } from "@/lib/request";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCreateDiagram() {
  return useMutation({
    mutationFn: diagramsApi.createDiagram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diagrams-project"] });
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
    queryFn: () => diagramsApi.getDiagram(diagramId),
  });
}
