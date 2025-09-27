export interface User {
  id: number;
  name: string;
  profilePhoto: string;
}

export interface NotificationResponse {
  id: number;
  type: string;
  iconName: string;
  title: string;
  description: string;
  timestamp: string;
  user?: User;
}