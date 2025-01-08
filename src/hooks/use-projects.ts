import { projectsApi } from "@/lib/api/projects";
import { queryClient } from "@/lib/request";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: projectsApi.getProjectsList,
    // 可以设置缓存时间
    staleTime: 1000 * 60, // 1分钟
  });
}

export function useDeleteProject() {
  return useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useCreateProject() {
  return useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
