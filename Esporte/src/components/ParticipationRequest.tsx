// components/ParticipationRequest.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { Feather } from "@expo/vector-icons"; // ícones finos (figma)
import { formatRelativeTime } from "../utils/date";

export interface ParticipationRequestProps {
  userName: string;
  timestamp: string;
  onAccept: () => void;
  onDecline: () => void;
  avatarUrl?: string;
  fallbackImage?: ImageSourcePropType;
  description?: string;
}

export default function ParticipationRequest({
  userName,
  timestamp,
  onAccept,
  onDecline,
  avatarUrl,
  fallbackImage,
  description = "solicitou entrar no evento",
}: ParticipationRequestProps) {
  return (
    <View className="flex-row items-center justify-between p-2 mb-2">
      <View className="flex-row items-center">
        <Image
          source={
            avatarUrl
              ? { uri: avatarUrl }
              : (fallbackImage ?? require("../assets/images/participante.png"))
          }
          className="w-14 h-14 rounded-full"
        />
        <View className="ml-3">
          <Text className="text-lg font-bold text-black">{userName}</Text>
          <Text className="text-base text-gray-600">{description}</Text>
          <Text className="text-sm text-gray-500">{formatRelativeTime(timestamp)}</Text>
        </View>
      </View>

      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={onAccept}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          className="p-2"
        >
          <Feather name="check" size={22} color="#22c55e" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDecline}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          className="p-2 ml-2"
        >
          <Feather name="x" size={22} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
