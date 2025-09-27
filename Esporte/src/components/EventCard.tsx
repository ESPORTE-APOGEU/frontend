import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PersonIcon from '../assets/icons/person.svg';

interface EventCardProps {
  eventName: string;
  location: string;
  date: string;
  participants: number;
  maxParticipants?: number;
  participantPhotos?: (string | null)[];
  image: ImageSourcePropType;
  price?: string;
  onPress?: () => void;
}

export default function EventCard({
  eventName = "Event Name",
  location = "Marquina Park - Vila Mariana",
  date = "Monday, Feb 15, 2025",
  participants = 2,
  maxParticipants,
  participantPhotos = [],
  image,
  price = "Free",
  onPress
}: EventCardProps) {
  const [avatarFailed, setAvatarFailed] = useState<boolean[]>(() => participantPhotos.map(() => false));
  const prevPhotosRef = useRef<(string | null)[] | null>(null);

  useEffect(() => {
    const prev = prevPhotosRef.current;
    const cur = participantPhotos || [];
    const changed =
      !prev || prev.length !== cur.length || cur.some((p, i) => p !== prev[i]);
    if (changed) {
      setAvatarFailed(cur.map(() => false));
      prevPhotosRef.current = [...cur];
    }
  }, [participantPhotos]);
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
        borderColor: '#555454',
        backgroundColor: '#FDFFF9'
      }}
    >
      {/* Imagem do evento */}
      <View className="relative">
        <Image 
          source={image} 
          className="w-full h-44"
          resizeMode="cover"
        />
        {/* Indicador de participantes no canto superior direito */}
        <View 
          className="absolute top-3 right-3 px-2 py-1 rounded-full flex-row items-center"
          style={{ backgroundColor: '#43A047' }}
        >
          <Text className="text-white ml-1 font-medium" style={{ fontSize: 12 }}>
            {maxParticipants ? `${participants}/${maxParticipants}` : participants}
          </Text>
          <PersonIcon width={12} height={12} style={{ marginLeft: 4 }} />
        </View>
        
        {/* Fotos dos participantes (removidas do overlay, irão para o footer) */}
      </View>
      
      {/* Informações do evento */}
      <View className="px-4 py-3">
        {/* Nome do evento */}
        <Text className="text-base font-semibold text-black mb-3" style={{ fontSize: 16 }}>
          {eventName}
        </Text>
        
        {/* Linha principal: coluna esquerda (local + data) e coluna direita (avatares + botão) */}
        <View className="flex-row items-start justify-between">
          {/* Coluna esquerda: localização + data */}
          <View style={{ flex: 1, paddingRight: 8 }}>
            <View className="flex-row items-start mb-2">
              <Ionicons name="location-outline" size={14} color="#6B7280" style={{ marginTop: 1 }} />
              <Text className="text-gray-500 ml-2 text-xs" style={{ fontSize: 12, lineHeight: 16 }}>
                {location}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={14} color="#6B7280" />
              <Text className="text-gray-500 ml-2 text-xs" style={{ fontSize: 12 }}>
                {date}
              </Text>
            </View>
          </View>

          {/* Coluna direita: avatares à esquerda do botão, na mesma linha */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
              {participantPhotos && participantPhotos.length > 0 ? (
                participantPhotos.slice(0, 3).map((photo, index) => (
                  <View
                    key={index}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: '#fff',
                      overflow: 'hidden',
                      marginLeft: index > 0 ? -10 : 0,
                      zIndex: participantPhotos.length - index,
                      elevation: participantPhotos.length - index,
                      backgroundColor: '#ddd'
                    }}
                  >
                    <Image
                      source={(!avatarFailed[index] && photo) ? { uri: photo } : require('../assets/images/participante.png')}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                      onError={() => {
                        console.warn(`Avatar failed to load: ${photo}`);
                        setAvatarFailed((prev) => {
                          const copy = [...prev];
                          copy[index] = true;
                          return copy;
                        });
                      }}
                    />
                  </View>
                ))
              ) : null}
              {participantPhotos && participantPhotos.length > 3 && (
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    marginLeft: -10,
                    zIndex: 0,
                    elevation: 0,
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                    +{participantPhotos.length - 3}
                  </Text>
                </View>
              )}
            </View>

            <View
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: '#43A047',
                shadowColor: '#000',
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Text className="text-white text-sm font-medium" style={{ fontSize: 14 }}>
                Entrar
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
