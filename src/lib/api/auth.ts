import { request } from "../request";
import type {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
} from "@/types/auth";

export interface UserSubscription {
  id: string;
  userId: string;
  isPro: boolean;
  remainingVersions: number;
  proExpiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    request.post<AuthResponse>("/users/login", credentials),

  signup: (credentials: SignupCredentials) =>
    request.post<AuthResponse>("/users/register", credentials),
  getUserSubscription: () =>
    request.get<UserSubscription>("/users/subscription"),
  upgradeSubscription: (data: { durationInDays: number }) =>
    request.post<UserSubscription>("/users/subscription/upgrade", data),
};
