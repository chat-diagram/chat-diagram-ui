import { request } from "../request";

export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type GetProjectListResponse = Project[];

export type CreateProjectResponse = Project;

export const projectsApi = {
  /**
   * get all projects of user
   */
  getProjectsList: () => request.get<GetProjectListResponse>("/projects"),
  getProject: (projectId: string) =>
    request.get<Project>(`/projects/${projectId}`),
  createProject: (data: { name: string; description: string }) =>
    request.post<CreateProjectResponse>("/projects", data),
  deleteProject: (projectId: string) =>
    request.delete(`/projects/${projectId}`),
};
