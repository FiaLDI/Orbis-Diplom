export interface Notification {
  id: number;
  type: string;
  title: string;
  body?: string | null;
  data?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationState {
  list: Notification[];
  onlineUsers: number[];
}