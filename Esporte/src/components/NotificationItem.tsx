// Em: components/NotificationItem.js

import React from 'react';
import { View, Text, Image } from 'react-native';
import { formatRelativeTime } from '../utils/date';
import { Notification } from '../app/notificacoes';

const iconMap = {
  whatsapp: require('../assets/images/whatsapp_icon.png'),
  calendar: require('../assets/images/calendario.png'),
  info: require('../assets/images/info_icon.png'),
};

interface NotificationItemProps {
  iconName: 'whatsapp' | 'calendar' | 'info';
  title: string;
  description: string | React.ReactNode;
  timestamp: string;
  tag?: { text: string; icon: 'whatsapp' | 'calendar' | 'info' };
}

type Props = { notification: Notification };

export default function NotificationItem({
  iconName,
  title,
  description,
  timestamp,
  tag,
  notification,
}: NotificationItemProps & Props) {
  return (
    <View className="flex-row items-start mb-6 p-4 border-b">
      {/* Ícone */}
      <View className="w-10 h-10 bg-[#25D366] rounded-full items-center justify-center mr-4">
        <Image source={iconMap[iconName]} className="w-6 h-6" resizeMode="contain" />
      </View>
      
      {/* Conteúdo */}
      <View className="flex-1">
        <Text className="text-base font-bold text-black mb-1">{title}</Text>
        <Text className="text-base text-gray-700">{description}</Text>
        
        {/* Rodapé da Notificação */}
        <View className="flex-row justify-between items-center mt-2">
            <Text className="text-sm italic text-blue-500">
              {formatRelativeTime(notification.timestamp)}
            </Text>
        </View>
      </View>
    </View>
  );
}