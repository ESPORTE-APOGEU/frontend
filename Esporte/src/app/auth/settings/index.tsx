import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import SettingItem from '@/src/components/settings/SettingItem';
import LargeButton from '@/src/components/ui/Forms/LargeButtom';
import BottomNavigation  from '@/src/components/FutterBar';
import LocationIcon from '@/src/components/icons/location';
import NotificationIcon from '@/src/components/icons/notifications';
import ProfileIcon from '@/src/components/icons/profile';
import SecurityIcon from '@/src/components/icons/security';
import HelpIcon from '@/src/components/icons/help';
import { Ionicons, MaterialIcons} from '@expo/vector-icons';


export default function SettingsMain() {
    const[notificationsPaused, setNotificationsPaused] = React.useState(false);

  return (
    <View className='flex-1'>
        <View className='p-6 mt-6'>
        <Text className='text-4xl font-bold p-4'>Configurações</Text>
            <SettingItem icon={<LocationIcon />} title="Localização"  onPress={() => console.log('Localização pressionada')} />
            <SettingItem 
                icon={<NotificationIcon />} 
                title="Notificações" 
                onPress={() => setNotificationsPaused(!notificationsPaused)} 
                switcherTitle="Pausar tudo" 
                switcherDescription="Pausar notificações temporariamente" 
                switcherValue={notificationsPaused} 
                onSwitcherValueChange={setNotificationsPaused} />
            <SettingItem
                icon={<ProfileIcon />}
                title="Perfil"
                onPress={() => console.log('Perfil pressionado')}
            />
            <SettingItem
                icon={<SecurityIcon />}
                title="Dados de Login"
                onPress={() => console.log('Dados de Login pressionados')}
            />
            <SettingItem
                icon={<HelpIcon />}
                title="Central de Ajuda"
                onPress={() => console.log('Ajuda pressionada')}
            />
        
        <Pressable className='flex-row items-center justify-center'>
        <Text className='text-lg mr-2'>Termos e condições</Text>
        <Ionicons name="document-outline" size={15} color="black" />
        </Pressable>
        </View>
        <View className='pt-16'>
        <LargeButton
            title="Sair da conta"
            iconRight={<MaterialIcons name="login" size={15} color="white" />}
            onPress={() => {
                Alert.alert(
                    "Sair",
                    "Você tem certeza que deseja sair?",
                    [
                        { text: "Cancelar", style: "cancel" },
                        { text: "Sair", onPress: () => console.log("Usuário saiu") }
                    ]
                );
            }}
        />
        </View>
      <BottomNavigation />
    </View>
  );
}