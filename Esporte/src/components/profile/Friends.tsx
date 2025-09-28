import React from "react";
import { View, Text } from "react-native";
import { FriendCard, images } from "./FriendCard";

export type FriendItem = {
  id: string;
  name: string;
  city: string;
  avatar: keyof typeof images;
  mutualAvatars?: (keyof typeof images)[];
  mutualCount: number;
};

export function Friends({
  friends,
  emptyText = "Você ainda não adicionou amigos",
}: {
  friends: FriendItem[];
  emptyText?: string;
}) {
  if (!friends || friends.length === 0) {
    return <Text className="px-7 text-[#969696] mt-4">{emptyText}</Text>;
  }

  return (
    <View>
      {friends.map((f) => (
        <FriendCard
          key={f.id}
          id={f.id}
          name={f.name}
          city={f.city}
          avatar={f.avatar}
          mutualAvatars={f.mutualAvatars}
          mutualCount={f.mutualCount}
          onPressAvatar={() => {}}
          onPressMutual={() => {}}
          onPressAdd={() => {}}
        />
      ))}
    </View>
  );
}
