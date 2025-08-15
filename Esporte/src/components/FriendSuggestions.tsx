import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { images } from "../assets/images";
import { getFriendSuggestions } from "../services/FriendSuggestionService";

export type Suggestion = {
  id: string;
  name: string;
  avatar: keyof typeof images;
  mutualCount: number;
  mutualAvatars: (keyof typeof images)[];
};

interface Props {
  loggedUserId: number;
}

export function FriendSuggestions({ loggedUserId }: Props) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const data = await getFriendSuggestions(loggedUserId);
        setSuggestions(data);
      } catch (error) {
        console.error("Erro ao buscar sugestões:", error);
      }
    };
    fetchSuggestions();
  }, [loggedUserId]);

  return (
    <>
      <Text className="text-black font-bold text-xl px-4 mb-4">
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
          <View className="flex-1">
            <Text className="text-black font-medium text-base">{s.name}</Text>
            <Text className="text-gray-600 text-[12px]">
              {s.mutualCount} amigos em comum
            </Text>
          </View>
          {/* Exibir as fotos dos amigos em comum */}
          <View className="flex-row items-center mr-1">
            {s.mutualAvatars.slice(0, 3).map((m, i) => (
              <Image
                key={i}
                source={images[m]}
                className={`w-6 h-6 rounded-full ${i ? "-ml-2" : ""}`}
              />
            ))}
          </View>
        </View>
      ))}
    </>
  );
}
