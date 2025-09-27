// Caminho: src/app/auth/home.tsx

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { useRouter, Href } from 'expo-router';


import SearchBar from '../../components/SearchBar';
import NotifyIcon from '../../assets/icons/notify.svg';
import FilterIcon from '../../assets/icons/filter.svg';
import EventCard from '../../components/EventCard';
import BottomNavigation from '../../components/FutterBar';
import FilterModal from '../../components/FilterModal';
import RatingModal from '../../components/RatingModal';
import ReportModal from '../../components/ReportModal';
import { useAuth } from '@clerk/clerk-expo';

export interface EventResponse {
  id: number;
  name: string;
  location: string;
  sport: string;
  level: string;
  gender: string;
  date: string;
  startTime: string;
  endTime: string;
  price: string | number;
  description: string;
  coverImageUrl?: string | null;

}

const DEFAULT_IMAGE = require('../../assets/images/default_card.png');
const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL; // ex.: http://192.168.x.x:8080

export default function Home() {
  const router = useRouter();

  const [searchText, setSearchText] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [pendingAvaliation, setPendingAvaliation] = useState<any>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  // JWT do Clerk nos headers
  const getAuthHeaders = async (withJsonContentType = false) => {
    const token =
      (await getToken({ template: 'backend', skipCache: true })) ||
      (await getToken({ template: 'backend' }));
    if (!token) throw new Error('Não foi possível obter o token JWT.');
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };
    if (withJsonContentType) headers['Content-Type'] = 'application/json';
    return headers;
  };

  const formatAxiosError = (err: any, fallback: string) => {
    return err?.response
      ? `Erro ${err.response.status}: ${
          typeof err.response.data === 'string'
            ? err.response.data
            : err.response.data?.message || fallback
        }`
      : err?.message || fallback;
  };

  // Carrega lista inicial quando autenticado + checa avaliação pendente
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setJwtToken(null);
      setEvents([]);
      setError('Você não está autenticado.');
      setPendingAvaliation(null);
      setRatingModalVisible(false);
      return;
    }

    if (!BASE_URL) {
      setError('EXPO_PUBLIC_BACKEND_URL não definida.');
      return;
    }

    (async () => {
      const token =
        (await getToken({ template: 'backend', skipCache: true })) ||
        (await getToken({ template: 'backend' }));
      setJwtToken(token || null);

      await fetchEvents();
      await checkPendingAvaliation(token);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  const checkPendingAvaliation = async (token?: string | null) => {
    console.log(token)
    try {
      if (!token || !BASE_URL) return;
      const res = await fetch(`${BASE_URL}/api/v1/avaliations/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.length > 0) {
        setPendingAvaliation(data[0]);
        setRatingModalVisible(true);
      } else {
        setPendingAvaliation(null);
        setRatingModalVisible(false);
      }
    } catch {
      setPendingAvaliation(null);
      setRatingModalVisible(false);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/events`, {
        headers: await getAuthHeaders(),
      });
      setEvents(res.data);
    } catch (err: any) {
      setEvents([]);
      setError(formatAxiosError(err, 'Falha ao buscar eventos'));
    } finally {
      setLoading(false);
    }
  };

  // --- Filtro ---
  const computeFilterCount = (f: any): number => {
    if (!f) return 0;
    let count = 0;
    if (f.sports && f.sports.length > 0) count += 1;
    if (f.levels && f.levels.length > 0) count += 1;
    if (f.date) count += 1;
    if (f.gender) count += 1;
    if (f.startTime && f.endTime) count += 1;
    if (f.maxDistanceKm) count += 1;
    return count;
  };

  const handleFilter = async (filter: any) => {
    if (!isSignedIn) {
      setEvents([]);
      setError('Você não está autenticado.');
      return;
    }
    if (!BASE_URL) {
      setError('EXPO_PUBLIC_BACKEND_URL não definida.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (filter === null) {
        setActiveFiltersCount(0);
        await fetchEvents();
        return;
      }
      setActiveFiltersCount(computeFilterCount(filter));
      const res = await axios.post(`${BASE_URL}/api/v1/events/filter`, filter, {
        headers: await getAuthHeaders(true),
      });
      setEvents(res.data);
    } catch (err: any) {
      setEvents([]);
      setError(formatAxiosError(err, 'Falha ao filtrar eventos'));
    } finally {
      setLoading(false);
    }
  };

  // --- Busca com debounce (server-side /search) ---
  const debouncedSearch = useRef(
    debounce(async (text: string) => {
      if (!BASE_URL || !isSignedIn) return;
      setLoading(true);
      setError(null);
      try {
        if (!text.trim()) {
          await fetchEvents();
          return;
        }
        const res = await axios.get(`${BASE_URL}/api/v1/events/search`, {
          params: { q: text },
          headers: await getAuthHeaders(),
        });
        setEvents(res.data);
      } catch (err: any) {
        setEvents([]);
        setError(formatAxiosError(err, 'Falha ao buscar eventos'));
      } finally {
        setLoading(false);
      }
    }, 500)
  ).current;

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  

  const handleNotificationPress = () => {
  router.push(('/auth/notificacoes') as Href);
};

  // --- Helpers de UI ---
  const priceLabel = (p: string | number | null | undefined) => {
    if (p === null || p === undefined) return 'Grátis';
    if (typeof p === 'number') return p > 0 ? `R$ ${p}` : 'Grátis';
    return p !== '0.00' && p !== '0' ? `R$ ${p}` : 'Grátis';
  };

const handleEventPress = (eventId: number) => {
  router.push((`/auth/event/${String(eventId)}`) as Href);
};

  return (
    <SafeAreaView className="flex-1 bg-[#F7FFED]">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View className="mt-16 mb-2 flex-row items-center justify-between px-4 bg-[#F7FFED]">
        <View className="flex-row items-center flex-1">

          <View className="flex-1">
            <SearchBar
              placeholder="Qual evento está procurando?"
              value={searchText}
              onChangeText={handleSearchChange}
            />
          </View>
        </View>
        <TouchableOpacity className="ml-2.5" onPress={() => handleNotificationPress()} >
          <NotifyIcon width={32} height={32} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      {/* Título + Filtro */}
      <View className="flex-row items-center justify-between mt-2 mb-2 px-5">
        <Text className="text-[22px] font-bold">Eventos</Text>
        <TouchableOpacity
          className="bg-[#43A047] rounded-full px-4 py-1.5 flex-row items-center"
          onPress={() => setFilterModalVisible(true)}
        >
          <Text className="text-white font-bold mr-1.5">Filtrar</Text>
          {activeFiltersCount > 0 ? (
            <View className="w-[22px] h-[22px] rounded-full bg-white items-center justify-center">
              <Text className="text-[#43A047] font-bold text-[12px]">
                {activeFiltersCount}
              </Text>
            </View>
          ) : (
            <FilterIcon width={12} height={12} style={{ marginLeft: 4 }} />
          )}
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {loading ? (
          <Text className="text-center mt-10">Carregando eventos...</Text>
        ) : error ? (
          <View className="mt-10 px-5">
            <Text className="text-center text-red-600">Erro: {error}</Text>
          </View>
        ) : events.length === 0 ? (
          <View className="mt-10 px-5">
            <Text className="text-center">Nenhum evento encontrado.</Text>
            <Text className="text-[12px] text-gray-400 mt-2.5 text-center">
              Debug: {JSON.stringify(events)}
            </Text>
          </View>
        ) : (
          events.map((ev) => (
            <EventCard
              key={ev.id}
              eventName={ev.name}
              location={ev.location}
              date={ev.date}
              participants={0}
              image={
                ev.coverImageUrl
                  ? { uri: ev.coverImageUrl } // usa a foto do Cloudinary
                  : DEFAULT_IMAGE              // fallback
              }              price={priceLabel(ev.price)}
              onPress={() => handleEventPress(ev.id)}
            />
          ))
        )}
      </ScrollView>

      {/* Modal de filtros */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onFilter={handleFilter}
      />

      {/* Modal de avaliação com pendência */}
      <RatingModal
        visible={ratingModalVisible}
        onClose={() => {
          setRatingModalVisible(false);
          setPendingAvaliation(null);
        }}
        user={
          pendingAvaliation
            ? {
                name: pendingAvaliation.toUserName,
                image: pendingAvaliation.toUserPhoto,
              }
            : undefined
        }
        avaliationId={pendingAvaliation?.avaliationId}
        token={jwtToken || undefined}
        onSuccess={() => {
          setPendingAvaliation(null);
          setRatingModalVisible(false);
          checkPendingAvaliation(jwtToken);
        }}
        onError={() => {
          setPendingAvaliation(null);
          setRatingModalVisible(false);
        }}
      />

      {/* Modal de report */}
      <ReportModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        onSubmit={(reason, description) => {
          console.log('Report enviado', { reason, description });
        }}
      />

      <BottomNavigation />
    </SafeAreaView>
  );
}
