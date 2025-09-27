import React from 'react';
import { View, Text, Pressable, Alert, Switch, ScrollView } from 'react-native';
import { router } from 'expo-router';
import BottomNavigation from '@/src/components/FutterBar';

import LocationIcon from '@/src/components/icons/location';
import NotificationIcon from '@/src/components/icons/notifications';
import ProfileIcon from '@/src/components/icons/profile';
import SecurityIcon from '@/src/components/icons/security';
import HelpIcon from '@/src/components/icons/help';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';

const BGCOLOR = '#F7FFED';
const GREEN = '#43A047';
const ROW_BG = 'rgba(253, 255, 249, 0.75)';

export default function SettingsMain() {
  const [notificationsPaused, setNotificationsPaused] = React.useState(false);
  const { signOut } = useAuth();

  const confirmSignOut = () => {
    Alert.alert('Sair', 'Você tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
          } finally {
            router.replace('/auth/sign-in');
          }
        },
      },
    ]);
  };


  return (
    <View className="flex-1" style={{ backgroundColor: BGCOLOR }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <View style={{ width: '86%', alignSelf: 'center', marginTop: '8%' }}>
          <Text
            style={{
              fontSize: 36,
              lineHeight: 54,
              fontWeight: '500',
              color: '#000',
            }}
          >
            Configurações
          </Text>
        </View>

        {/* Linhas de configuração (estilo Figma) */}
        <View style={{ width: '86%', alignSelf: 'center', marginTop: 16 }}>
          <SettingRow
            icon={<LocationIcon />}
            title="Localização"
            onPress={() => router.push('/auth/settings/Andress')}
          />

          <SettingRow
            icon={<NotificationIcon />}
            title="Notificações"
            hasSwitch
            switchValue={notificationsPaused}
            onSwitchChange={setNotificationsPaused}
          />

          <SettingRow
            icon={<ProfileIcon />}
            title="Perfil"
            onPress={() => router.push('/auth/settings/EditProfileScreen')}
          />

          <SettingRow
            icon={<SecurityIcon />}
            title="Dados de login"
            onPress={() => router.push('/auth/settings/dadosLogin')}
          />

          <SettingRow
            icon={<HelpIcon />}
            title="Central de ajuda"
            onPress={() => router.push('/auth/public/help')}
          />
        </View>

        {/* Termos e condições */}
        <Pressable
          onPress={() => router.push('/auth/public/terms')}
          style={{
            alignSelf: 'center',
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 16, color: '#292D32', marginRight: 6 }}>
            Termos e condições
          </Text>
          <Ionicons name="document-outline" size={15} color="#292D32" />
        </Pressable>

        {/* Botão Sair da conta */}
        <Pressable
          onPress={confirmSignOut}
          style={{
            width: '86%',
            alignSelf: 'center',
            height: 54,
            borderRadius: 12,
            backgroundColor: GREEN,
            marginTop: 24,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600', marginRight: 8 }}>
            Sair da conta
          </Text>
          <MaterialIcons name="login" size={18} color="#fff" />
        </Pressable>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
}

/** Linha de configuração com visual do Figma */
function SettingRow({
  icon,
  title,
  onPress,
  hasSwitch = false,
  switchValue,
  onSwitchChange,
}: {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (v: boolean) => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={{
        width: '100%',
        height: 54,
        backgroundColor: ROW_BG,
        borderRadius: 12,
        borderBottomWidth: 2,
        borderBottomColor: GREEN,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '6%',
      }}
    >
      {/* Ícone à esquerda */}
      <View style={{ width: 33, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
        {icon}
      </View>

      {/* Título alinhado à direita como no Figma */}
      <View style={{ flex: 1, alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 16, color: '#000' }}>{title}</Text>
      </View>

      {/* Switch opcional (somente na linha de Notificações) */}
      {hasSwitch ? (
        <View style={{ marginLeft: 12 }}>
          <Switch
            value={!!switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#c7c7c7', true: '#bfe6c7' }}
            thumbColor={switchValue ? GREEN : '#f4f3f4'}
          />
        </View>
      ) : null}
    </Pressable>
  );
}
