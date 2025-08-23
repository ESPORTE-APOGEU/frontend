// Em: screens/Notificacoes.js

import React, { useEffect, useState } from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  ScrollView, 
  StatusBar, 
  TouchableOpacity, 
  ImageSourcePropType
} from 'react-native';
import { getNotifications } from '../services/NotificationService';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import { acceptEventEntry, declineEventEntry } from '../services/EventEntryService'
import { NotificationResponse } from "../interfaces/Notification";

// Importando os novos componentes
import NotificationItem from '../components/NotificationItem';
import ParticipationRequest from '../components/ParticipationRequest';
import BottomNavigation from '../components/FutterBar';

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface Notification {
    tag: { text: string; icon: "whatsapp" | "calendar" | "info"; } | undefined;
    iconName: "whatsapp" | "calendar" | "info";
    userName: string;
    userImage: ImageSourcePropType;
    type: string;
    id: number;
    title: string;
    description: string;
    timestamp: string;
    // adicione outros campos conforme necessário
}

export default function Notificacoes() {
  const userId = 35; // Substitua pelo ID do usuário logado
  const [notificationsData, setNotificationsData] = useState<NotificationResponse[]>([]);

  const loadNotifications = async () => {
    try {
      const { data } = await getNotifications(userId);
      // Garante que seja um array, mesmo que data seja undefined
      setNotificationsData(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erro ao carregar notificações:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleAccept = async (entryId: number) => {
    await acceptEventEntry(entryId)
    loadNotifications()
  }
  const handleDecline = async (entryId: number) => {
    await declineEventEntry(entryId)
    loadNotifications()
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F0F0F0]">
      <StatusBar barStyle="dark-content" backgroundColor="#F0F0F0" />

      {/* Cabeçalho */}
      <View className="flex-row items-center justify-between p-5 mt-12">
        <Text className="text-4xl font-bold text-black">Notificações</Text>
        <TouchableOpacity className="w-10 h-10 bg-[#25D366] rounded-full items-center justify-center">
          <Text className="text-white font-bold text-xl">X</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Mapeando os dados para renderizar os componentes dinamicamente */}
        {notificationsData.map(item => {
          if (item.type === 'entry_request') {
            return (
              <ParticipationRequest
                key={item.id}
                id={item.id}
                userImage={item.user?.profilePhoto || ""}
                userName={item.user?.name || ""}
                timestamp={item.timestamp}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            )
          }
          return (
            <NotificationItem
              key={item.id}
              iconName={item.iconName as "whatsapp" | "calendar" | "info"}
              title={item.title}
              description={item.description}
              timestamp={item.timestamp}
              tag={{ text: item.type, icon: item.iconName as "whatsapp" | "calendar" | "info" }}
            />
          );
        })}
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}