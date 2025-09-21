// src/app/notificacoes/index.tsx
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  FlatList,
} from "react-native";
import { useAuth } from "@clerk/clerk-expo";

import NotificationItem from "../../components/NotificationItem";
import ParticipationRequest from "../../components/ParticipationRequest";
import BottomNavigation from "../../components/FutterBar";
import {
  getMyNotifications,
  acceptEventEntry,
  declineEventEntry,
  NotificationDTO,
} from "../../services/NotificationService";
import { attachAuth } from "@/src/services/Api";

export default function Notificacoes() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // injeta JWT do Clerk em TODAS as chamadas via api
    attachAuth(() => getToken({ template: "backend", skipCache: true }));
  }, [getToken]);

  const fetchNotifications = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    try {
      setLoading(true);
      const data = await getMyNotifications();
      setNotifications(data);
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err?.response?.data?.message || err?.message || "Falha ao carregar notificações"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleAccept = async (entryId?: number | null, notificationId?: number) => {
    if (!entryId) return;
    try {
      await acceptEventEntry(entryId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err?.response?.data?.message || err?.message || "Não foi possível aceitar a solicitação"
      );
    }
  };

  const handleDecline = async (entryId?: number | null, notificationId?: number) => {
    if (!entryId) return;
    try {
      await declineEventEntry(entryId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err?.response?.data?.message || err?.message || "Não foi possível recusar a solicitação"
      );
    }
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
        <TouchableOpacity
          className="w-10 h-10 bg-[#E0F0E0] rounded-full items-center justify-center"
          onPress={fetchNotifications}
        >
          <Text className="text-gray-500 font-bold text-xl">↻</Text>
        </TouchableOpacity>
      </View>

<FlatList
  data={notifications}
  keyExtractor={(n) => String(n.id)}
  renderItem={({ item }) => {
    console.log(item);
    if (item.type === "entry_request") {
      return (
        <ParticipationRequest
          userName={item.actorName || "Usuário"}
          timestamp={item.timestamp}
          avatarUrl={item.actorPhoto || undefined}
          fallbackImage={require("../../assets/images/participante.png")}
          description={item.description} // exibe o texto do backend também
          onAccept={() => handleAccept(item.entryId, item.id)}
          onDecline={() => handleDecline(item.entryId, item.id)}
        />
      );
    }
    return <NotificationItem notification={item} />;
  }}

        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="px-6">
            <Text className="text-gray-500">Sem notificações por aqui…</Text>
          </View>
        }
      />

      <BottomNavigation />
    </SafeAreaView>
  );
}
