import { request } from "../request";
import type {
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
  User,
} from "@/types/auth";

export const authApi = {
  login: (credentials: LoginCredentials) =>
    request.post<AuthResponse>("/users/login", credentials),

  signup: (credentials: SignupCredentials) =>
    request.post<AuthResponse>("/users/register", credentials),

  getCurrentUser: () => request.get<User>("/auth/me"),
};
