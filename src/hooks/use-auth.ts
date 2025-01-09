"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
// import type { LoginCredentials, SignupCredentials } from "@/types/auth";
import { useRouter } from "next/navigation";
import { queryClient } from "@/lib/request";
import { useAppStore } from "@/store/app";

export function useLogin() {
  const router = useRouter();
  const { setUser } = useAppStore();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // 保存 token
      localStorage.setItem("token", data.token);
      // 更新缓存中的用户信息
      queryClient.setQueryData(["user"], data.user);
      setUser(data.user);
      // 跳转到首页
      router.push("/");
    },
  });
}

export function useSignup() {
  const router = useRouter();
  const { setUser } = useAppStore();

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      setUser(data.user);
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
