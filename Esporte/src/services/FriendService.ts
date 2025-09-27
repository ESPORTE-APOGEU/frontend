import { api } from "./Api";
import { User } from "./UserService";

export type FriendLite = Pick<User, "id" | "name" | "city" | "photo"> & {
  mutualCount?: number; // se quiser calcular no back
};

export async function getUserFriends(userId: string): Promise<FriendLite[]> {
  const { data } = await api.get(`/friendships/${userId}/friends`);
  console.log("amigos: " +  data);
  return data;
}

export type MutualFriendsDTO = {
  total: number;
  users: { id: string; name?: string | null; photo?: string | null }[];
};

export async function getMutualFriends(otherUserId: string): Promise<MutualFriendsDTO> {
  const { data } = await api.get(`/friendships/mutual/${encodeURIComponent(otherUserId)}`);
  return data;
}