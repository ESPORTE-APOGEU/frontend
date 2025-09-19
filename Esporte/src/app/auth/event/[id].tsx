// src/app/auth/event/[id].tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';

type ApiEvent = {
  id: number;
  name: string;
  location: string;
  sport: string;
  level: string;
  gender: string;
  date: string;
  startTime: string;
  endTime: string;
  price: string | number | null;
  description: string | null;
  organizerId?: string | null;
  organizerName?: string | null;
};

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const BGCOLOR = '#F7FFED';
const GREEN = '#43A047';
const CHIP = '#7ABD7A';

export default function EventDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const eventId = Number(id);
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const priceLabel = (p: string | number | null | undefined) => {
    if (p === null || p === undefined) return 'Grátis';
    if (typeof p === 'number') return p > 0 ? `R$ ${p}` : 'Grátis';
    return p !== '0.00' && p !== '0' ? `R$ ${p}` : 'Grátis';
  };

  const formatDate = (iso: string | null | undefined) => {
    if (!iso) return '';
    // evita problemas de timezone com LocalDate do backend
    const d = new Date(`${iso}T00:00:00`);
    return d.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const shortTime = (t?: string | null) => (t ? t.slice(0, 5) : '');

  const getAuthHeaders = async (withJson = false) => {
    const token =
      (await getToken({ template: 'backend', skipCache: true })) ||
      (await getToken({ template: 'backend' }));
    if (!token) throw new Error('Sem JWT do Clerk.');
    const h: Record<string, string> = { Authorization: `Bearer ${token}`, Accept: 'application/json' };
    if (withJson) h['Content-Type'] = 'application/json';
    return h;
  };

  useEffect(() => {
    if (!isLoaded) return;
    if (!BASE_URL) {
      setError('EXPO_PUBLIC_BACKEND_URL não definida.');
      return;
    }
    if (!isSignedIn) {
      setError('Você não está autenticado.');
      return;
    }
    if (!eventId || Number.isNaN(eventId)) {
      setError('ID de evento inválido.');
      return;
    }

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/events/${eventId}`, {
          headers: await getAuthHeaders(),
        });
        setEvent(res.data);
        console.log(res.data)
      } catch (err: any) {
        const msg =
          err?.response
            ? `Erro ${err.response.status}: ${
                typeof err.response.data === 'string'
                  ? err.response.data
                  : err.response.data?.message || 'Falha ao carregar evento'
              }`
            : err?.message || 'Falha ao conectar';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [isLoaded, isSignedIn, eventId]);

  const handleSolicitarEntrada = async () => {
    try {
      if (!BASE_URL) throw new Error('BASE_URL não definida.');
      await axios.post(
        `${BASE_URL}/api/v1/events/${eventId}/entries`,
        {},
        { headers: await getAuthHeaders(true) }
      );
      Alert.alert('Sucesso', 'Solicitação enviada!');
    } catch (err: any) {
      const msg =
        err?.response
          ? `Erro ${err.response.status}: ${
              typeof err.response.data === 'string'
                ? err.response.data
                : err.response.data?.message || 'Falha ao solicitar entrada'
            }`
          : err?.message || 'Falha ao conectar';
      Alert.alert('Erro', msg);
    }
  };

  const dateLabel = useMemo(() => formatDate(event?.date), [event?.date]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: BGCOLOR }}>
        <Text>Carregando evento...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: BGCOLOR }}>
        <Text className="text-red-600 text-center">{error}</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text style={{ color: GREEN }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!event) return null;

  return (
    <View className="flex-1" style={{ backgroundColor: BGCOLOR }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {/* Top bar (ícone voltar + “Nome do evento” como no Figma) */}
        <View className="flex-row items-center justify-between px-5 pt-5 mt-8 mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={GREEN} />
          </TouchableOpacity>
          <Text
            className="font-medium"
            style={{ fontSize: 32, lineHeight: 48, color: '#000', includeFontPadding: false }}
            numberOfLines={1}
          >
            {event.name}
          </Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Banner */}
        <Image
          source={require('../../../assets/images/default_card.png')}
          className="mx-7 mt-4 rounded-[20px]"
          resizeMode="cover"
          style={{ width: '86%', height: 188 }}
        />

        {/* Seções */}
        {/* Descrição */}
        <View className="mt-6 px-7">
          <Text className="font-medium text-black" style={{ fontSize: 28, lineHeight: 42 }}>
            Descrição
          </Text>
          {!!event.description && (
            <Text
              className="mt-2 text-black"
              style={{ fontSize: 15, lineHeight: 18, textAlign: 'justify' as any }}
            >
              {event.description}
            </Text>
          )}
        </View>

        {/* Cards/linhas com ícone verde (como os retângulos 24/25/30 do Figma) */}
        <View className="mt-6 px-7 space-y-10">
          <InfoLine
            bgColor={CHIP}
            icon={<Ionicons name="calendar-outline" size={20} color="#fff" />}
            title={dateLabel}
            subtitle={`${shortTime(event.startTime)} - ${shortTime(event.endTime)}`}
          />
          <InfoLine
            bgColor={CHIP}
            icon={<Ionicons name="location-outline" size={20} color="#fff" />}
            title={event.location}
            subtitle={`Valor de entrada: ${priceLabel(event.price)}`}
          />
          <InfoLine
            bgColor={CHIP}
            icon={<Ionicons name="people-outline" size={20} color="#fff" />}
            title={'Vagas restantes'}
            subtitle={'—'} // sem dado no EventResponse; preencha quando tiver
          />
        </View>

        {/* Nível & Gênero — chips circulares do Figma */}
        <View className="mt-6 px-7">
          <View className="flex-row items-center">
            <CircleChip>
              <Ionicons name="ribbon-outline" size={18} color="#fff" />
            </CircleChip>
            <Text className="ml-3 text-black" style={{ fontSize: 16, lineHeight: 19 }}>
              {event.level}
            </Text>

            <View style={{ width: 24 }} />

            <CircleChip>
              <Ionicons name="male-female-outline" size={18} color="#fff" />
            </CircleChip>
            <Text className="ml-3 text-black" style={{ fontSize: 16, lineHeight: 19 }}>
              {event.gender}
            </Text>
          </View>
        </View>

{/* Organizador do Evento */}
<View className="mt-8 px-7">
  <Text className="font-medium text-black" style={{ fontSize: 24, lineHeight: 36 }}>
    Organizador do Evento
  </Text>

  <View className="mt-3 flex-row items-center">
    <Image
      source={

         require('../../../assets/images/amigo1.png') // fallback local
      }
      style={{
        width: 48,
        height: 48,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 4,
      }}
    />
    <Text className="ml-3 text-black" style={{ fontSize: 16, lineHeight: 19 }}>
      {event.organizerName || 'Organizador'}
    </Text>
  </View>
</View>


        {/* Participantes */}
        <View className="mt-8 px-7 mb-2">
          <Text className="font-medium text-black" style={{ fontSize: 24, lineHeight: 36 }}>
            Participantes
          </Text>

          {/* placeholders visuais (substitua por sua lista real quando tiver a API aqui) */}
          <View className="mt-3 flex-row items-center">
            <Image
              source={require('../../../assets/images/amigo2.png')}
              style={{ width: 44, height: 44, borderRadius: 30, shadowColor: '#000', shadowOpacity: 0.25, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 4 }}
            />
            <Text className="ml-3 text-black" style={{ fontSize: 16, lineHeight: 19 }}>
              Alexandre Silva
            </Text>
          </View>

          <View className="mt-3 flex-row items-center">
            <Image
              source={require('../../../assets/images/amigo3.png')}
              style={{ width: 48, height: 48, borderRadius: 30, shadowColor: '#000', shadowOpacity: 0.25, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 4 }}
            />
            <Text className="ml-3 text-black" style={{ fontSize: 16, lineHeight: 19 }}>
              Jéssica Oliveira
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA fixo */}
      <TouchableOpacity
        className="absolute left-5 right-5 items-center justify-center"
        style={{
          bottom: 32,
          height: 54,
          backgroundColor: GREEN,
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 2, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 4,
        }}
        onPress={handleSolicitarEntrada}
      >
        <Text className="text-white" style={{ fontSize: 24, lineHeight: 36, fontWeight: '600' }}>
          Solicitar entrada
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/** Linha com quadrado verde à esquerda (como os retângulos 24/25/30) */
function InfoLine({
  icon,
  title,
  subtitle,
  bgColor = '#7ABD7A',
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  bgColor?: string;
}) {
  return (
    <View className="flex-row items-start">
      <View
        className="items-center justify-center"
        style={{
          width: 38,
          height: 38,
          borderRadius: 5,
          backgroundColor: bgColor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 4,
          margin: 0,
          marginBottom: 14,
        }}
      >
        {icon}
      </View>

      <View className="ml-4 flex-1">
        <Text className="text-black" style={{ fontSize: 16, lineHeight: 19 }}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={{ fontSize: 14, lineHeight: 17, color: '#979696', marginTop: 2 }}>{subtitle}</Text>
        )}
      </View>
    </View>
  );
}

/** Chip circular verde (nível/gênero) */
function CircleChip({ children }: { children: React.ReactNode }) {
  return (
    <View
      className="items-center justify-center"
      style={{
        width: 38,
        height: 38,
        borderRadius: 35,
        backgroundColor: '#7ABD7A',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      {children}
    </View>
  );
}
