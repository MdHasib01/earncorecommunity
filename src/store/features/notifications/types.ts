export interface NotificationItem {
  _id?: string;
  title: string;
  email: string;
  username: string;
  fullName: string;
  status: "unread" | "read";
  user?: string; // ObjectId
  post?: string; // ObjectId
  createdAt?: string;
  updatedAt?: string;
}