export interface AppNotification {
  _id: string;
  type: "order" | "payment" | "announcement";
  title: string;
  message: string;
  link: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  data: AppNotification[];
  unread: number;
}
