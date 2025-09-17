// components/ParticipationRequest.tsx

import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType
} from "react-native";
import { formatRelativeTime } from "../utils/date";

export interface ParticipationRequestProps {
  userImage: ImageSourcePropType;
  userName: string;
  timestamp: string;
  onAccept: () => void;
  onDecline: () => void;
}

export default function ParticipationRequest({
  userImage,
  userName,
  timestamp,
  onAccept,
  onDecline
}: ParticipationRequestProps) {
  return (
    <View className="flex-row items-center justify-between p-2 mb-2">
      <View className="flex-row items-center">
        <Image source={userImage} className="w-14 h-14 rounded-full" />
        <View className="ml-3">
          <Text className="text-lg font-bold text-black">{userName}</Text>
          <Text className="text-base text-gray-600">
            solicitou entrar no evento
          </Text>
          <Text className="text-sm text-gray-500">
            {formatRelativeTime(timestamp)}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={onAccept}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          className="p-2"
        >
          <Text className="text-green-500 text-2xl font-bold">✓</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDecline}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          className="p-2 ml-2"
        >
          <Text className="text-red-500 text-3xl font-bold">×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}