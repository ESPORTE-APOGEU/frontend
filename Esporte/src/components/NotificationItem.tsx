// Em: components/NotificationItem.js

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { formatRelativeTime } from '../utils/date';
import { Notification } from '../app/notificacoes';

const iconMap = {
  whatsapp: require('../assets/images/whatsapp_icon.png'),
  calendar: require('../assets/images/Calendar.png'), // ← usar exatamente o nome certo (case sensitive em build)
  info: require('../assets/images/info_icon.png'),
};

interface NotificationItemProps {
  iconName: 'whatsapp' | 'calendar' | 'info';
  title: string;
  description: string | React.ReactNode;
  timestamp: string;
  tag?: { text: string; icon: 'whatsapp' | 'calendar' | 'info' };
}

type Props = { notification: Notification };

export default function NotificationItem({
  iconName,
  title,
  description,
  timestamp,
  notification,
}: NotificationItemProps & Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={iconMap[iconName]} style={styles.icon} resizeMode="contain" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{description}</Text>
        <View style={styles.footer}>
          <Text style={styles.timestamp}>{formatRelativeTime(notification.timestamp)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 24,
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#25D366',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'Poppins',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 20,
    color: '#000000',
    backgroundColor: '#00000000', // transparente
  },
  message: {
    fontFamily: 'SF Pro',
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 16,
    color: '#000000',
    backgroundColor: '#00000000',
  },
  footer: {
    marginTop: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#555',
  },
});