// src/services/users.service.ts
import { api } from "./Api";

export type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_SAY";

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  birthday?: string | null;
  gender?: Gender | null;
  city?: string | null;
  sports: string[];
  photo?: string | null;
};

export type UpdateUserDTO = Partial<
  Pick<
    User,
    "name" | "email" | "birthday" | "gender" | "city" | "sports" | "photo"
  >
>;

export async function getUser(id: string): Promise<User> {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export async function updateUser(
  id: string,
  payload: UpdateUserDTO
): Promise<User> {
  const { data } = await api.put(`/users/${id}`, payload);
  return data;
}

export async function updateUserSports(
  id: string,
  sports: string[]
): Promise<User> {
  const { data } = await api.patch(`/users/${id}/sports`, sports);
  return data;
}
