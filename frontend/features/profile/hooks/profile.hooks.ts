import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  changePassword,
} from "../api/profile.api";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

export const PROFILE_QUERY_KEY = ["profile"];


export const useProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
  });
};


export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEY,
      });
    },
  });
};


export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAvatar,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEY,
      });
    },
  });
};


export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAvatar,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROFILE_QUERY_KEY,
      });
    },
  });
};


export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,

    onSuccess: (data) => {
      toast.success(
        data.message ??
        "Password updated successfully."
      );
    },

    onError: (error: unknown) => {
  console.log("CHANGE PASSWORD ERROR:", error);

  if (axios.isAxiosError(error)) {

    toast.error(
      error.response?.data?.message ??
      "Failed to update password."
    );

    return;
  }

  toast.error("Something went wrong.");
}
  });
};