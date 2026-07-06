export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar: string | null;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ProfileResponse {
  user: User;
}