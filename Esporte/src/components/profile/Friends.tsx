// src/components/profile/Friends.tsx
import React from "react";
import { View, Text, ImageSourcePropType } from "react-native";
import { FriendCard } from "./FriendCard";

export type FriendItem = {
  id: string;
  name: string;
  city: string;
  avatarSrc: ImageSourcePropType;
  mutualAvatarSrcs?: ImageSourcePropType[];
  mutualCount: number;
};

export function Friends({ friends, emptyText = "Você ainda não adicionou amigos" }:{
  friends: FriendItem[]; emptyText?: string;
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
          avatarSrc={f.avatarSrc}
          mutualAvatarSrcs={f.mutualAvatarSrcs}
          mutualCount={f.mutualCount}
          onPressAvatar={() => {}}
          onPressMutual={() => {}}
          onPressAdd={() => {}}
        />
      ))}
    </View>
  );
}
