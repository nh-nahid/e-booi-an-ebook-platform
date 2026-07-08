import { api } from "@/services/api/api";
import { ENDPOINTS } from "@/services/api/endpoints";

import type { UpdateProfilePayload } from "../schemas/update-profile.schema";
import type { ChangePasswordPayload } from "../schemas/change-password.schema";

import type {
  ProfileResponse,
  UpdateProfileResponse,
  AvatarResponse,
} from "../types/profile.types";


export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await api.get<ProfileResponse>(
    ENDPOINTS.USER.PROFILE
  );

  return response.data;
};


export const updateProfile = async (
  data: UpdateProfilePayload
): Promise<UpdateProfileResponse> => {
  const response = await api.patch<UpdateProfileResponse>(
    ENDPOINTS.USER.PROFILE,
    data
  );

  return response.data;
};


export const uploadAvatar = async (
  formData: FormData
): Promise<AvatarResponse> => {
  const response = await api.patch<AvatarResponse>(
    ENDPOINTS.USER.PROFILE_AVATAR,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const deleteAvatar = async (): Promise<{
  message: string;
}> => {
  const response = await api.delete<{ message: string }>(
    ENDPOINTS.USER.PROFILE_AVATAR
  );

  return response.data;
};


export const changePassword = async (
  data: ChangePasswordPayload
) => {
  const response = await api.patch(
    ENDPOINTS.USER.CHANGE_PASSWORD,
    data
  );

  return response.data;
};