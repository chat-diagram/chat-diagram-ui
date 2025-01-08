import { request } from "../request";

export interface Diagram {
  id: string;
  title: string;
  description: string;
  mermaidCode: string;
  currentVersion: number;
  userId: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type GetDiagramListResponse = Diagram[];
export type GetDiagramListByProjectIdResponse = Diagram[];

export type CreateDiagramRequest = Pick<
  Diagram,
  "title" | "projectId" | "description"
>;

export type CreateDiagramVersionRequest = {
  comment: string;
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
};
