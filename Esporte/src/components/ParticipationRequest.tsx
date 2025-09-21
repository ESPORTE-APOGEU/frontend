// components/ParticipationRequest.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { formatRelativeTime } from "../utils/date";

export interface ParticipationRequestProps {
  userName: string;
  timestamp: string;
  onAccept: () => void;
  onDecline: () => void;
  avatarUrl?: string;                       // ← novo: foto remota (Google)
  fallbackImage?: ImageSourcePropType;      // ← opcional fallback local
  description?: string;                     // ← opcional: usar texto do backend
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
          source={avatarUrl ? { uri: avatarUrl } : (fallbackImage ?? require("../assets/images/participante.png"))}
          className="w-14 h-14 rounded-full"
        />
        <View className="ml-3">
          <Text className="text-lg font-bold text-black">{userName}</Text>
          <Text className="text-base text-gray-600">{description}</Text>
          <Text className="text-sm text-gray-500">
            {formatRelativeTime(timestamp)}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity onPress={onAccept} className="p-2" activeOpacity={0.7}>
          <Text className="text-green-500 text-2xl font-bold">✓</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDecline} className="p-2 ml-2" activeOpacity={0.7}>
          <Text className="text-red-500 text-3xl font-bold">×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
