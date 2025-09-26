import { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView, View, Text, StatusBar, TouchableOpacity,
  ActivityIndicator, RefreshControl, Alert, FlatList, ImageBackground,
} from "react-native";
import { useAuth } from "@clerk/clerk-expo";

import NotificationItem from "../../components/NotificationItem"; // <- versão figma (variant/strongText/etc.)
import ParticipationRequest from "../../components/ParticipationRequest";
import BottomNavigation from "../../components/FutterBar";
import {
  getMyNotifications,
  acceptEventEntry,
  declineEventEntry,
  markNotificationRead,
  archiveNotification,
  NotificationDTO,
} from "../../services/NotificationService";
import { attachAuth } from "@/src/services/Api";

export default function Notificacoes() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    attachAuth(() => getToken({ template: "backend", skipCache: true }));
  }, [getToken]);

  const fetchNotifications = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;
    try {
      setLoading(true);
      const data = await getMyNotifications("active");
      setNotifications(data);

      const toRead = data.filter(n => n.status === "NEW");
      if (toRead.length) {
        Promise.allSettled(toRead.map(n => markNotificationRead(n.id))).catch(() => {});
      }
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

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleAccept = async (entryId?: number | null, notificationId?: number) => {
    if (!entryId) return;
    try {
      await acceptEventEntry(entryId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
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
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err: any) {
      Alert.alert(
        "Erro",
        err?.response?.data?.message || err?.message || "Não foi possível recusar a solicitação"
      );
    }
  };

  const handleArchive = async (notificationId: number) => {
    try {
      await archiveNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err: any) {
      Alert.alert("Erro",
        err?.response?.data?.message || err?.message || "Não foi possível arquivar");
    }
  };

  // ---------- helper para extrair nome do evento e localização ----------
// helper: extraia nome e local
function extractParts(n: NotificationDTO) {
  let eventName = "";

  if (n.type === "entry_accepted" && n.description) {
    const m = n.description.match(/evento:\s*(.+?)(\.|$)/i);
    if (m?.[1]) eventName = m[1].trim();
  }
  if (!eventName) {
    eventName =
      (n.tagText && n.tagText.trim()) ||
      (n.description?.match(/"([^"]+)"/)?.[1]) ||
      "";
  }

  // LOCAL
  let location = "";
  if (n.type === "event_location") {
    // 1) se um dia vier no tagText, usa
    if (n.tagText && n.tagText.trim()) {
      location = n.tagText.trim();
    }
    // 2) tenta extrair da descrição “... localizado em X”
    if (!location && n.description) {
      const m = n.description.match(/localizado\s+em\s+(.+)$/i);
      if (m?.[1]) location = m[1].trim();
    }
  }

  return { eventName, location };
}


  // ---------------------------------------------------------------------

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

        <TouchableOpacity className="w-10 h-10 items-center justify-center" onPress={fetchNotifications}>
          <ImageBackground
            source={require("../../assets/images/RETANGULO.png")}
            style={{ width: 40, height: 38 }}
            imageStyle={{ borderRadius: 12 }}
          >
            <View className="flex-1 items-center justify-center" />
          </ImageBackground>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(n) => String(n.id)}
        renderItem={({ item }) => {
          // 4) Pedido para participar — mantém seu componente
          if (item.type === "entry_request") {
            return (
              <ParticipationRequest
                userName={item.actorName || "Usuário"}
                timestamp={item.timestamp}
                avatarUrl={item.actorPhoto || undefined}
                fallbackImage={require("../../assets/images/participante.png")}
                description={item.description}
                onAccept={() => handleAccept(item.entryId, item.id)}
                onDecline={() => handleDecline(item.entryId, item.id)}
              />
            );
          }

          // Demais tipos com o front do Figma
          const { eventName, location } = extractParts(item);
          if (item.type === "entry_accepted") {
            const { eventName } = extractParts(item);
            return (
              <NotificationItem
                variant="accepted"
                title="Você foi aceito no evento!"
                message={`Você foi aceito no `}
                strongText={eventName || "seu evento"}
                extraText="! Clique aqui para entrar no grupo de WhatsApp."
                timestamp={item.timestamp}
                iconName="whatsapp"
                tagText={eventName || item.tagText || ""}
                tagUrl={item.tagUrl}
              />
            );
          }

          if (item.type === "event_start_reminder") {
            return (
              <NotificationItem
                variant="reminder"
                title="O evento já vai começar!"
                message={
                  eventName
                    ? `${eventName} começa em 2 horas!`
                    : (item.description || "")
                }
                extraText="Você está pronto?!"
                timestamp={item.timestamp}
                iconName="calendar"
              />
            );
          }

          if (item.type === "event_location") {
            const { eventName, location } = extractParts(item);
            return (
              <NotificationItem
                variant="location"
                title="Local do evento"
                message={
                  eventName
                    ? `${eventName} está localizado em`
                    : (item.description || "")
                }
                strongText={location}   // agora preenche
                timestamp={item.timestamp}
                iconName="info"
              />
            );
          }

          // fallback info simples
          return (
            <NotificationItem
              variant="info"
              title={item.title || "Notificação"}
              message={item.description || ""}
              timestamp={item.timestamp}
              iconName={item.iconName === "calendar" ? "calendar" : "info"}
            />
          );
        }}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
