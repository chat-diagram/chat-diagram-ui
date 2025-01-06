export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  email: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
