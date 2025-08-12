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
import axios from 'axios';

// Importando os novos componentes
import NotificationItem from '../components/NotificationItem';
import ParticipationRequest from '../components/ParticipationRequest';
import BottomNavigation from '../components/FutterBar';

export default function Notificacoes() {
  const [notificationsData, setNotificationsData] = useState<any[]>([]);
  const userId = 123; // substitua pelo ID do usuário logado

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`http://192.168.100.10:8080/api/v1/users/${userId}/notifications`);
        setNotificationsData(res.data);
      } catch (e) {
        console.error("Erro ao buscar notificações:", e);
      }
    };
    fetch();
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