// src/components/FriendSuggestions.tsx
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
    <View>
      <Text className="text-black font-extrabold text-[24px] px-4 mb-4">
        Sugestão de amigos
      </Text>

      {suggestions.map((s) => (
        <View
          key={s.id}
          className="flex-row items-center rounded-lg px-4 py-3 mx-4 mb-3"
        >
          <Image
            source={images[s.avatar]}
            className="w-8 h-8 rounded-full mr-4"
          />

          <Text className="flex-1 text-black font-semibold text-[16px]">
            {s.name}
          </Text>

          <View className="flex-row items-center mr-2">
            {(s.mutualAvatars ?? []).slice(0, 3).map((m, i) => (
              <Image
                key={i}
                source={images[m]}
                className={`w-6 h-6 rounded-full ${i ? "-ml-2" : ""}`}
              />
            ))}
          </View>

          <Text className="text-black text-[18px] mr-2">{s.mutualCount}</Text>

          <TouchableOpacity className="w-24 h-7 bg-[#43A047] rounded-lg justify-center items-center">
            <Text className="text-white font-bold text-[12px]">Adicionar</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
