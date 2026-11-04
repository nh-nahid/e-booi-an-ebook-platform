import { api } from "@/services/api/api";
import type { NotificationsResponse } from "../types/notification.types";

export const getNotifications = async (): Promise<NotificationsResponse> => {
  const { data } = await api.get<NotificationsResponse>("/notifications");
  return data;
};

export const markNotificationRead = async (id: string) => {
  await api.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = async () => {
  await api.patch("/notifications/read-all");
};

export const deleteNotification = async (id: string) => {
  await api.delete(`/notifications/${id}`);
};
