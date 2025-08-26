// screens/Notificacoes.tsx

import { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  ImageSourcePropType,
  RefreshControl,
  Alert
} from 'react-native';

// Importando os novos componentes
import NotificationItem from '../components/NotificationItem';
import ParticipationRequest from '../components/ParticipationRequest';
import BottomNavigation from '../components/FutterBar';
import { getNotifications, acceptEventEntry, declineEventEntry } from '../services/NotificationService';

// Definindo a interface para o tipo de notificação
export interface Notification {
  id: number;
  type: 'info' | 'entry_request';        // “entry_request” é o tipo enviado pelo backend
  iconName?: 'whatsapp' | 'calendar' | 'info';
  title?: string;
  description?: string;
  timestamp: string;
  tag?: { text: string; icon: 'whatsapp' | 'calendar' | 'info' };
  user?: { id: number; name: string; profilePhoto?: string };
  relatedEventId?: number;               // será usado como entryId na tela de solicitações
}

// Dados estáticos que correspondem à sua imagem
const mockNotificationsData: Notification[] = [
  {
    id: 1,
    type: 'info',
    iconName: 'whatsapp',
    title: 'Você foi aceito no evento!',
    description: 'Você foi aceito no 5K Group Run! Clique aqui para entrar no grupo de WhatsApp.',
    timestamp: 'Enviado há 2 horas',
    tag: { text: '5K Group Run!', icon: 'whatsapp' }
  },
  {
    id: 2,
    type: 'info',
    iconName: 'calendar',
    title: 'O evento já vai começar!',
    description: '5K Group Run começa em 2 horas! Você está pronto?!',
    timestamp: 'Enviado há 2 horas',
  },
  {
    id: 3,
    type: 'info',
    iconName: 'info',
    title: 'Local do evento',
    description: '5K Group Run está localizado em Ibirapuera Park - Vila Mariana.',
    timestamp: 'Enviado há 12 horas',
  },
  {
    id: 4,
    type: 'request',
    userImage: require('../assets/images/alexandre_silva.png'),
    userName: 'Alexandre Silva',
    timestamp: 'Ontem',
  }
];

export default function Notificacoes() {
  const [notifications, setNotifications] = useState<any[]>([]);
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

  // Ajusta handleAccept/handleDecline para receber também o notificationId
  const handleAccept = async (entryId: number, notificationId: number) => {
    console.log('[Notificacoes] handleAccept chamado com entryId=', entryId, 'notificationId=', notificationId);
    if (!entryId || entryId === -1) {
      console.warn('entryId inválido para accept:', entryId);
      return;
    }
    try {
      await acceptEventEntry(entryId);
      console.log('[Notificacoes] Evento aceito no backend:', entryId);
      // remove a notificação pelo seu id, não pelo entryId
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

      {/* Cabeçalho */}
      <View className="flex-row items-center justify-between p-5 mt-12">
        <Text className="text-4xl font-bold text-black">Notificações</Text>
        <TouchableOpacity className="w-10 h-10 bg-[#E0F0E0] rounded-full items-center justify-center" onPress={fetchNotifications}>
          <Text className="text-gray-500 font-bold text-xl">X</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {notifications.length === 0 ? (
          <View className="mt-12 items-center">
            <Text className="text-lg text-gray-600">Nenhuma notificação</Text>
            <TouchableOpacity className="mt-4 px-4 py-2" onPress={fetchNotifications}>
              
              
            </TouchableOpacity>
          </View>
        ) : (
          notifications.map(item => {
            if (item.type === 'entry_request') {
              // relatedEventId vem do backend e corresponde ao event-entry id
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
                  // aqui passamos também o id da notificação para o filtro
                  onAccept={() => handleAccept(entryId, item.id)}
                  onDecline={() => handleDecline(entryId, item.id)}
                />
              );
            }

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
          })
        )}
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}

function n(value: any, index: number, array: any[]): value is any {
  throw new Error('Function not implemented.');
}
