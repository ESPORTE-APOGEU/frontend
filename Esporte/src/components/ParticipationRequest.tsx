// Em: components/ParticipationRequest.js

import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface Props {
  id: number;
  userImage: string;
  userName: string;
  timestamp: string;
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
}

export default function ParticipationRequest({
  id,
  userImage,
  userName,
  timestamp,
  onAccept,
  onDecline,
}: Props) {
  return (
    <View className="flex-row items-center justify-between bg-white p-4 mb-2 rounded-lg shadow">
      <Image
        source={
          userImage
            ? { uri: userImage }
            : require("../assets/images/participante.png")
        }
        className="w-12 h-12 rounded-full"
      />
      <View className="flex-1 ml-4">
        <Text className="text-sm text-gray-500">
          Pedido de participação no evento
        </Text>
        <Text className="text-base font-bold">
          {userName} quer participar do evento
        </Text>
        <Text className="text-xs text-gray-400">
          {dayjs(timestamp).fromNow()}
        </Text>
      </View>
      <View className="flex-row space-x-2">
        <TouchableOpacity onPress={() => onAccept(id)}>
          <Text className="text-green-500 text-2xl">✅</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDecline(id)}>
          <Text className="text-red-500 text-2xl">❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}