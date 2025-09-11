// src/components/FriendRequests.tsx
import React, { ReactNode } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { images } from "../assets/images";

export type Request = {
  mutualCount: ReactNode;
  id: string;
  name: string;
  avatar: keyof typeof images;
  // Removemos city e role
};

interface Props {
  requests: Request[];
  onAccept: (requestId: number) => void;
  onReject: (requestId: number) => void;
}

export function FriendRequests({ requests, onAccept, onReject }: Props) {
  return (
    <>
      <Text className="text-black font-bold text-xl px-4 mb-4">
        Solicitações de amizade
      </Text>
      {requests.map((r) => (
        <View
          key={r.id}
          className="flex-row items-start rounded-lg px-4 py-3 mx-4 mb-3"
        >
          <Image
            source={images[r.avatar]}
            className="w-11 h-11 rounded-full mr-4"
          />
          <View className="flex-1">
            <Text className="text-black font-medium text-base">
              {r.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <FontAwesome5 
                name="user-friends" 
                size={12} 
                color="#424242" 
                className="mr-1" 
              />
              <Text className="text-gray-600 text-[12px]">
                {r.mutualCount} amigos em comum
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="w-6 h-6 border border-gray-700 rounded-full mr-2 justify-center items-center"
            onPress={() => onReject(Number(r.id))}
          >
            <Feather name="x" size={10} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-6 h-6 border border-blue-400 rounded-full justify-center items-center"
            onPress={() => onAccept(Number(r.id))}
          >
            <Feather name="check" size={10} color="#587DBD" />
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
}