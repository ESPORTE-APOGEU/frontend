import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { images } from "../assets/images";

export type Suggestion = {
  id: string;
  name: string;
  avatar: keyof typeof images;
  mutualCount: number;
  mutualAvatars?: (keyof typeof images)[];
};

interface Props {
  suggestions: Suggestion[];
}

export function FriendSuggestions({ suggestions }: Props) {
  return (
    <>
      <Text className="text-black font-bold text-xl px-4 mb-4">
        Sugestão de amigos
      </Text>
      {suggestions.map((s) => (
        <View
          key={s.id}
          className="flex-row items-center rounded-lg px-4 py-3 mx-4 mb-3">
          <Image
            source={images[s.avatar]}
            className="w-8 h-8 rounded-full mr-4"
          />
          <Text className="flex-1 text-black font-medium text-base">
            {s.name}
          </Text>
          <View className="flex-row items-center mr-1">
            {(s.mutualAvatars ?? []).slice(0, 3).map((m, i) => (
              <Image
                key={i}
                source={images[m]}
                className={`w-6 h-6 rounded-full ${i ? "-ml-2" : ""}`}
              />
            ))}
          </View>
          <Text className="text-black text-base mr-2">{s.mutualCount}</Text>
          <TouchableOpacity className="w-24 h-7 bg-green-500 rounded-lg justify-center items-center">
            <Text className="text-white font-bold text-[12px]">Connect</Text>
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
}
