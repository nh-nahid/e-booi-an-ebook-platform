import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../api/notification.api";

const KEY = ["notifications"];

export const useNotifications = (enabled = true) =>
  useQuery({
    queryKey: KEY,
    queryFn: getNotifications,
    enabled,
    // light polling keeps the bell badge fresh without sockets
    refetchInterval: 60_000,
  });

function useInvalidating<T>(fn: (arg: T) => Promise<void>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export const useMarkRead = () => useInvalidating<string>(markNotificationRead);
export const useMarkAllRead = () => useInvalidating<void>(markAllNotificationsRead);
export const useDeleteNotification = () => useInvalidating<string>(deleteNotification);
