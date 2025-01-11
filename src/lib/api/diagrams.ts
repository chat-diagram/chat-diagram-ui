import { request } from "../request";
import { Project } from "./projects";

export interface Diagram {
  id: string;
  title: string;
  description: string;
  mermaidCode: string;
  currentVersion: number;
  userId: string;
  project: Project;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  versions: DiagramVersion[];
}
export interface DiagramVersion {
  id: string;
  comment: string;
  mermaidCode: string;
  createdAt: string;
  updatedAt: string;
  versionNumber: number;
  description: string;
}

export type GetDiagramListResponse = Diagram[];
export type GetDiagramListByProjectIdResponse = Diagram[];

export type CreateDiagramRequest = Pick<
  Diagram,
  "projectId" | "description"
> & { title?: string };

export type CreateDiagramVersionRequest = {
  description: string;
};

export const diagramsApi = {
  /**
   * get all diagrams of user
   */
  getDiagrams: () => request.get<GetDiagramListResponse>("/diagrams"),
  getDiagramsByProjectId: (projectId: string) =>
    request.get<GetDiagramListByProjectIdResponse>(
      `/diagrams/project/${projectId}`
    ),
  getDiagram: (diagramId: string) =>
    request.get<Diagram>(`/diagrams/${diagramId}`),
  createDiagram: (data: CreateDiagramRequest) =>
    request.post("/diagrams", data),
  deleteDiagram: (diagramId: string) =>
    request.delete(`/diagrams/${diagramId}`),
  getDiagramVersions: (diagramId: string) =>
    request.get<Diagram>(`/diagrams/${diagramId}/versions`),
  createDiagramVersion: (
    diagramId: string,
    data: CreateDiagramVersionRequest
  ) => request.post(`/diagrams/${diagramId}/versions`, data),
  rollbackDiagramVersion: (diagramId: string, version: number) =>
    request.post(`/diagrams/${diagramId}/versions/${version}/rollback`),
  restoreDiagram: (diagramId: string) =>
    request.post(`/diagrams/${diagramId}/restore`),
  renameDiagram: (diagramId: string, data: { title: string }) =>
    request.post(`/diagrams/${diagramId}/title`, data),
};
