// screens/Notificacoes.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  FlatList,
  StyleSheet
} from 'react-native';

import NotificationItem from '../components/NotificationItem';
import ParticipationRequest from '../components/ParticipationRequest';
import BottomNavigation from '../components/FutterBar';
import { getNotifications, acceptEventEntry, declineEventEntry } from '../services/NotificationService';

export interface Notification {
  id: number;
  type: 'info' | 'entry_request' | 'event_start_reminder' | 'event_location';
  iconName?: 'whatsapp' | 'calendar' | 'info';
  title?: string;
  description?: string;
  timestamp: string;
  tag?: { text: string; icon: 'whatsapp' | 'calendar' | 'info' };
  user?: { id: number; name: string; profilePhoto?: string };
  relatedEventId?: number;
}

export default function Notificacoes() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const userId = 3; // sempre 3
    const data = await getNotifications(userId);
    console.log('Resposta do backend:', data);
    const list: Notification[] = Array.isArray(data) ? data : data.notifications ?? [];
    setNotifications(list);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleAccept = async (entryId: number, notificationId: number) => {
    console.log('[Notificacoes] handleAccept chamado com entryId=', entryId, 'notificationId=', notificationId);
    if (!entryId || entryId === -1) {
      console.warn('entryId inválido para accept:', entryId);
      return;
    }
    try {
      await acceptEventEntry(entryId);
      console.log('[Notificacoes] Evento aceito no backend:', entryId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('[Notificacoes] erro ao aceitar:', err);
      Alert.alert('Erro', 'Não foi possível aceitar a solicitação');
    }
  };

  const handleDecline = async (entryId: number, notificationId: number) => {
    console.log('[Notificacoes] handleDecline chamado com entryId=', entryId, 'notificationId=', notificationId);
    if (!entryId || entryId === -1) {
      console.warn('entryId inválido para decline:', entryId);
      return;
    }
    try {
      await declineEventEntry(entryId);
      console.log('[Notificacoes] Evento recusado no backend:', entryId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('[Notificacoes] erro ao recusar:', err);
      Alert.alert('Erro', 'Não foi possível recusar a solicitação');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F9FFF8] items-center justify-center">
        <ActivityIndicator size="large" color="#07D362" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F9FFF8]">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FFF8" />
      <View className="flex-row items-center justify-between p-5 mt-12">
        <Text className="text-4xl font-bold text-black">Notificações</Text>
        <TouchableOpacity className="w-10 h-10 bg-[#E0F0E0] rounded-full items-center justify-center" onPress={fetchNotifications}>
          <Text className="text-gray-500 font-bold text-xl">X</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          if (item.type === 'entry_request') {
            const entryId = item.relatedEventId ?? -1;
            const userImage = require('../assets/images/participante.png');
            const userName  = item.user?.name ?? 'Usuário';
            return (
              <ParticipationRequest
                key={item.id} 
                entryId={entryId}
                userImage={userImage}
                userName={userName}
                timestamp={item.timestamp}
                onAccept={() => handleAccept(entryId, item.id)}
                onDecline={() => handleDecline(entryId, item.id)}
              />
            );
          } else if (item.type === 'event_start_reminder' || item.type === 'event_location') {
            // Exibe notificações de lembrete de início e local do evento
            return (
              <View key={item.id} className="bg-white rounded-lg p-4 mb-4 shadow">
                <Text className="text-lg font-semibold text-black">{item.title}</Text>
                <Text className="text-base text-gray-700 mt-1">{item.description}</Text>
                <Text className="text-sm italic text-blue-500 mt-2">Enviado: {item.timestamp}</Text>
              </View>
            );
          } else {
            return (
              <NotificationItem
                key={item.id}
                iconName={item.iconName!}
                title={item.title!}
                description={item.description!}
                timestamp={item.timestamp}
                tag={item.tag}
              />
            );
          }
        }}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  item: { marginBottom: 12, padding: 8, borderBottomWidth: 1, borderColor: "#eee" },
  text: { fontSize: 16 },
  date: { fontSize: 12, color: "#888", marginTop: 4 }
});
