// src/components/FriendRequests.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { images } from "../assets/images";

export type Request = {
  id: string;
  name: string;
  avatar: keyof typeof images;
  city: string;
  role: string;
};

interface Props {
  requests: Request[];
}

export function FriendRequests({ requests }: Props) {
  return (
    <>
      <Text className="text-black font-bold text-xl px-4 mb-4">
        Solicitações de amizade
      </Text>
      {requests.map((r) => (
        <View
          key={r.id}
          className="flex-row items-start rounded-lg px-4 py-3 mx-4 mb-3">
          <Image
            source={images[r.avatar]}
            className="w-11 h-11 rounded-full mr-4"
          />
          <View className="flex-1">
            <Text className="text-black font-medium text-base">{r.name}</Text>
            <View className="flex-row items-center mt-0.5">
              <Feather
                name="map-pin"
                size={12}
                color="#424242"
                className="mr-1"
              />
              <Text className="text-gray-600 text-[12px]">{r.city}</Text>
            </View>
            <View className="flex-row items-center mt-0.5">
              <Feather
                name="briefcase"
                size={12}
                color="#424242"
                className="mr-1"
              />
              <Text className="text-gray-600 text-[12px]">{r.role}</Text>
            </View>
          </View>
          <TouchableOpacity className="w-6 h-6 border border-gray-700 rounded-full mr-2 justify-center items-center">
            <Feather name="x" size={10} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity className="w-6 h-6 border border-blue-400 rounded-full justify-center items-center">
            <Feather name="check" size={10} color="#587DBD" />
          </TouchableOpacity>
        </View>
      ))}
          
    </>
  );
}
