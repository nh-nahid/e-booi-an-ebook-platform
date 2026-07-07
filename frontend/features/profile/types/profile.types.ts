export interface ProfileResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}


export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}


export interface AvatarResponse {
  success: boolean;
  message: string;
  data: {
    avatar: string;
  };
}


export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}


export interface UserProfile {
  _id: string;

  name: string;
  email: string;

  role: "user" | "admin";

  avatar?: string | null;

  phone?: string;
  bio?: string;

  createdAt?: string;

  booksOwned?: number;
  ordersCount?: number;
}