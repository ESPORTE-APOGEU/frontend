// Em: screens/Notificacoes.js

import React, { useEffect, useState } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  ScrollView, 
  StatusBar, 
  TouchableOpacity 
} from 'react-native';
import { fetchNotifications } from '../services/NotificationService'; // Importando o serviço

// Importando os novos componentes
import NotificationItem from '../components/NotificationItem';
import ParticipationRequest from '../components/ParticipationRequest';
import BottomNavigation from '../components/FutterBar';

export default function Notificacoes() {
  const [notificationsData, setNotificationsData] = useState<any[]>([]);
  const userId = 123; // Substitua pelo ID do usuário logado

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications(userId); // Usando o serviço
        setNotificationsData(data);
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    };

    loadNotifications();
  }, []);

  // Funções para lidar com as ações de aceitar/recusar
  const handleAccept = () => console.log('Pedido aceito!');
  const handleDecline = () => console.log('Pedido recusado!');

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
          if (item.type === 'request') {
            return (
              <ParticipationRequest
                key={item.id}
                userImage={item.userImage}
                userName={item.userName}
                timestamp={item.timestamp}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            );
          }
          return (
            <NotificationItem
              key={item.id}
              iconName={item.iconName}
              title={item.title}
              description={item.description}
              timestamp={item.timestamp}
              tag={item.tag}
            />
          );
        })}
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}