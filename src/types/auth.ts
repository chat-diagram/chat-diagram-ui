import { UserSubscription } from "@/lib/api/auth";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  email: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  subscription?: UserSubscription;
}

export interface AuthResponse {
  user: User;
  token: string;
}
