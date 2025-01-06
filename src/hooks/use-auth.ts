"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
// import type { LoginCredentials, SignupCredentials } from "@/types/auth";
import { useRouter } from "next/navigation";
import { queryClient } from "@/lib/request";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      debugger;

      // 保存 token
      localStorage.setItem("token", data.token);
      // 更新缓存中的用户信息
      queryClient.setQueryData(["user"], data.user);
      // 跳转到首页
      router.push("/");
    },
  });
}

export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      queryClient.setQueryData(["user"], data.user);
      router.push("/");
    },
  });
}

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    // 由于数据已经在 cache 中,不需要 queryFn
    enabled: false,
  });
}
