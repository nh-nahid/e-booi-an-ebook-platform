export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  adminCode?: string;
}

export interface RegisterResponse {
  message: string;
}

export interface ProfileResponse {
  user: User;
}