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
