import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EventCardProps {
  eventName: string;
  location: string;
  date: string;
  participants: number;
  image: ImageSourcePropType;
  price?: string;
  onPress?: () => void;
}

export default function EventCard({
  eventName = "Event Name",
  location = "Marquina Park - Vila Mariana",
  date = "Monday, Feb 15, 2025",
  participants = 2,
  image,
  price = "Free",
  onPress
}: EventCardProps) {
  return (
    <TouchableOpacity 
      className="bg-white mx-4 mb-4 rounded-xl overflow-hidden"
      onPress={onPress}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 0.5,
        borderColor: '#555454'
      }}
    >
      {/* Imagem do evento */}
      <View className="relative">
        <Image 
          source={image} 
          className="w-full h-44"
          resizeMode="cover"
        />
      </View>
      
      {/* Informações do evento */}
      <View className="px-4 py-3">
        {/* Nome do evento */}
        <Text className="text-base font-semibold text-black mb-3" style={{ fontSize: 16 }}>
          {eventName}
        </Text>
        
        {/* Localização */}
        <View className="flex-row items-start mb-2">
          <Ionicons name="location-outline" size={14} color="#6B7280" style={{ marginTop: 1 }} />
          <Text className="text-gray-500 ml-2 text-xs flex-1" style={{ fontSize: 12, lineHeight: 16 }}>
            {location}
          </Text>
        </View>
        
        {/* Data */}
        <View className="flex-row items-center mb-4">
          <Ionicons name="calendar-outline" size={14} color="#6B7280" />
          <Text className="text-gray-500 ml-2 text-xs" style={{ fontSize: 12 }}>
            {date}
          </Text>
        </View>
        
        {/* Footer com participantes e preço */}
        <View className="flex-row items-center justify-between">
          {/* Participantes */}
          <View className="flex-row items-center">
            <Ionicons name="people-outline" size={14} color="#6B7280" />
            <Text className="text-gray-500 ml-1 text-xs" style={{ fontSize: 12 }}>
              {participants}
            </Text>
          </View>
          
          {/* Preço/Status */}
          <View className="px-3 py-1 rounded-full" style={{ backgroundColor: '#07D362' }}>
            <Text className="text-white text-xs font-medium" style={{ fontSize: 12 }}>
              View
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
