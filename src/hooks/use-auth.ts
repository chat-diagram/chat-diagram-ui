"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
// import type { LoginCredentials, SignupCredentials } from "@/types/auth";
import { useRouter } from "next/navigation";
import { queryClient } from "@/lib/request";
import { useAppStore } from "@/store/app";
import { message } from "antd";

export function useLogin() {
  const router = useRouter();
  const { setUser } = useAppStore();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      // 保存 token
      localStorage.setItem("token", data.token);

      // 获取用户订阅信息
      const subscription = await authApi.getUserSubscription();
      data.user.subscription = subscription;

      // 更新缓存中的用户信息
      queryClient.setQueryData(["user"], data.user);
      setUser(data.user);
      // 跳转到首页
      router.push("/");
      // 获取用户订阅信息
    },
  });
}

export function useUpdateSubscription() {
  const { user, setUser, setShowUpgrade } = useAppStore();
  return useMutation({
    mutationFn: authApi.getUserSubscription,
    onSuccess: (data) => {
      if (user) {
        user.subscription = data;
        // todo 假数据
        // user.subscription.remainingVersions = 1000000;
        // user.subscription.isPro = true;
        // user.subscription.proExpiresAt = "2029-01-13";
        setShowUpgrade(false);
        //
        queryClient.setQueryData(["user"], user);
        setUser(user);
      }
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

export function useLogout() {
  const router = useRouter();
  const { setUser } = useAppStore();

  return useMutation({
    mutationFn: async () => {
      // 清除 token
      localStorage.removeItem("token");
      // 清除用户信息
      setUser(null);
      // 清除 react-query 缓存
      queryClient.setQueryData(["user"], null);
      // 跳转到登录页
      router.push("/login");
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

export function useDeleteUser() {
  const logout = useLogout();
  return useMutation({
    mutationFn: authApi.deleteUser,
    onSuccess: () => {
      message.success("deleted user successfully");
      logout.mutate();
    },
  });
}
