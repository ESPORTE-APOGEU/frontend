// src/components/FriendsList.tsx
import React from "react";
import { View } from "react-native";
import { FriendCard } from "./FriendCard";
import { images } from "./FriendCard";

export type FriendItem = {
  id: string;
  name: string;
  city: string;
  avatar: keyof typeof images;
  mutualAvatars?: (keyof typeof images)[];
  mutualCount: number;
};

export function Friends({ friends }: { friends: FriendItem[] }) {
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
