import { useState, useEffect, useCallback } from 'react';
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
  Image,
  ImageBackground
} from 'react-native';

import NotificationItem from '../components/NotificationItem';
import ParticipationRequest from '../components/ParticipationRequest';
import BottomNavigation from '../components/FutterBar';
import { getNotifications, acceptEventEntry, declineEventEntry, deleteNotification } from '../services/NotificationService';
import { formatRelativeTime } from '../utils/date';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

export interface Notification {
  id: number;
  type: 'info' | 'entry_request' | 'event_start_reminder' | 'event_location' | 'entry_accepted' | 'entry_declined';
  iconName?: 'whatsapp' | 'calendar' | 'info';
  title?: string;
  description?: string;
  timestamp: string;
  tag?: { text: string; icon: 'whatsapp' | 'calendar' | 'info' };
  user?: { id: number; name: string; profilePhoto?: string };
  relatedEventId?: number;
  entryId?: number;
}

export default function Notificacoes() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const CURRENT_USER_ID = 4; // alinhar com quem realmente deve ver as entry_request
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotifications(CURRENT_USER_ID);
      console.log('[Notificacoes] recebidas:', data); // DEBUG
      setNotifications(data);
    } catch (e) {
      console.error('[Notificacoes] falha ao carregar', e);
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
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
      setNotifications(prev => prev.filter(n => n.id !== notificationId)); // ← corrigido
    } catch (err) {
      console.error('[Notificacoes] erro ao recusar:', err);
      Alert.alert('Erro', 'Não foi possível recusar a solicitação');
    }
  };

  const handleSwipeDelete = async (id: number) => {
    try { await deleteNotification(id); } catch { /* backend opcional */ }
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const renderRightActions = (onDelete: () => void) => (
    <View style={{ height: '100%', justifyContent: 'center', paddingRight: 12 }}>
      <TouchableOpacity
        onPress={onDelete}
        style={{
          width: 56,
          height: 40,                // altura menor
          backgroundColor: '#FFFFFF',// fundo branco
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 2
        }}
      >
        <Image
          source={require('../assets/images/lixeira.png')}
          style={{ width: 20, height: 20 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  // Fallback para mensagens fixas caso backend não envie (segurança)
  function resolveFixed(notification: Notification) {
    if (notification.type === 'event_start_reminder' && (!notification.title || !notification.description)) {
      return {
        title: 'O evento já vai começar!',
        description: `${notification.title ? '' : ''}${notification.description || 'Em 2 horas! Você está pronto?!'}`
      };
    }
    if (notification.type === 'event_location' && (!notification.title || !notification.description)) {
      return {
        title: 'Local do evento',
        description: notification.description || 'Confira o local do evento.'
      };
    }
    if (notification.type === 'entry_accepted' && (!notification.title || !notification.description)) {
      return {
        title: 'Você foi aceito no evento!',
        description: notification.description || 'Você foi aceito no evento!'
      };
    }
    if (notification.type === 'entry_declined' && (!notification.title || !notification.description)) {
      return {
        title: 'Pedido recusado',
        description: notification.description || 'Seu pedido foi recusado.'
      };
    }
    return { title: notification.title || '', description: notification.description || '' };
  }

  if (loading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 bg-[#F9FFF8] items-center justify-center">
          <ActivityIndicator size="large" color="#07D362" />
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-[#F9FFF8]">
        <StatusBar barStyle="dark-content" backgroundColor="#F9FFF8" />
        <View className="flex-row items-center justify-between p-5 mt-12">
          <Text className="text-4xl font-bold text-black">Notificações</Text>
          <TouchableOpacity
            className="w-10 h-10 items-center justify-center"
            onPress={fetchNotifications}
          >
            <ImageBackground
              source={require('../assets/images/RETANGULO.png')}
              style={{ width: 40, height: 38 }}
              imageStyle={{ borderRadius: 12 }}
            >
              <View className="flex-1 items-center justify-center">
                <Image
                  source={require('../assets/images/fechar.png')} // ajuste o nome se for diferente
                  style={{ width: 18, height: 18 }}
                  resizeMode="contain"
                />
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <FlatList
          data={notifications}
          keyExtractor={n => String(n.id)}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => renderRightActions(() => handleSwipeDelete(item.id))}
              onSwipeableOpen={(dir) => dir === 'right' && handleSwipeDelete(item.id)}
              overshootRight={false}
            >
              {item.type === 'entry_request' ? (
                <ParticipationRequest
                  userImage={item.user?.profilePhoto ? { uri: item.user.profilePhoto } : require('../assets/images/participante.png')}
                  userName={item.user?.name || ''}
                  timestamp={item.timestamp}
                  onAccept={() => handleAccept(item.entryId!, item.id)}
                  onDecline={() => handleDecline(item.entryId!, item.id)}
                />
              ) : (
                (() => {
                  const fixed = resolveFixed(item);
                  const defaultIcon = item.type === 'event_start_reminder' ? 'calendar' : 'info';
                  return (
                    <NotificationItem
                      notification={item}
                      iconName={item.iconName ?? defaultIcon}
                      title={fixed.title}
                      description={fixed.description}
                      timestamp={item.timestamp}
                    />
                  );
                })()
              )}
            </Swipeable>
          )}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
        <BottomNavigation />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
