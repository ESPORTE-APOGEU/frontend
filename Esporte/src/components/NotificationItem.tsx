// components/NotificationItem.tsx
import React from "react";
import { View, Text, Image } from "react-native";
import { formatRelativeTime } from "../utils/date";
import type { NotificationDTO } from "../services/NotificationService";

const iconMap = {
  whatsapp: require("../assets/images/whatsapp_icon.png"),
  calendar: require("../assets/images/calendario.png"),
  info: require("../assets/images/info_icon.png"),
} as const;

type Props = {
  notification: NotificationDTO;
  onArchive?: () => void; // opcional
};

export default function NotificationItem({ notification }: Props) {
  const iconKey =
    (notification.iconName as keyof typeof iconMap) && iconMap[notification.iconName as keyof typeof iconMap]
      ? (notification.iconName as keyof typeof iconMap)
      : "info";

  return (
    <View className="flex-row items-start mb-6 p-4 border-b">
      {/* Ícone */}
      <View className="w-10 h-10 bg-[#25D366] rounded-full items-center justify-center mr-4">
        <Image source={iconMap[iconKey]} className="w-6 h-6" resizeMode="contain" />
      </View>

      {/* Conteúdo */}
      <View className="flex-1">
        <Text className="text-base font-bold text-black mb-1">{notification.title}</Text>
        <Text className="text-base text-gray-700">{notification.description}</Text>

        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-sm italic text-blue-500">
            {formatRelativeTime(notification.timestamp)}
          </Text>

          {!!notification.tagText && (
            <View className="px-2 py-1 rounded bg-[#E7F7E7]">
              <Text className="text-xs text-[#2E7D32]">
                {notification.tagText}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
