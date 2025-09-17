// Caminho sugerido: src/app/auth/home.tsx (ajuste se precisar)

import React, { useEffect, useMemo, useRef, useState } from 'react';
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

import SearchBar from '../../components/SearchBar';
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
}

const DEFAULT_IMAGE = require('../../assets/images/default_card.png');
const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL; // ex.: http://192.168.x.x:8080

export default function Home() {
  const [searchText, setSearchText] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const { getToken, isLoaded, isSignedIn } = useAuth();

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

  // -------- Fetch inicial (somente autenticado) --------
  useEffect(() => {
    if (!isLoaded) return;
    if (!BASE_URL) {
      setError('EXPO_PUBLIC_BACKEND_URL não definida.');
      return;
    }
    if (!isSignedIn) {
      setEvents([]);
      setError('Você não está autenticado.');
      return;
    }
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

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

  // -------- Filtro --------
  const computeFilterCount = (f: any): number => {
    if (!f) return 0;
    let count = 0;
    if (f.sports && f.sports.length > 0) count += 1;
    if (f.levels && f.levels.length > 0) count += 1;
    if (f.date) count += 1;
    if (f.startTime && f.endTime) count += 1;
    if (f.maxDistanceKm) count += 1;
    return count;
    // adicione mais regras aqui se o modal passar novos campos
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

  // -------- Busca com debounce (server-side /search) --------
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

  // -------- UI --------
  const priceLabel = (p: string | number | null | undefined) => {
    if (p === null || p === undefined) return 'Grátis';
    if (typeof p === 'number') return p > 0 ? `R$ ${p}` : 'Grátis';
    return p !== '0.00' && p !== '0' ? `R$ ${p}` : 'Grátis';
  };

  const handleEventPress = (eventId: number) => {
    console.log('Event pressed:', eventId);
    // navegação/ação futura
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View className="mt-5 flex-row items-center justify-between px-4 bg-[#F8F9FA]">
        <View className="flex-row items-center flex-1">
          <Image
            source={require('../../assets/images/logo_home.png')}
            className="w-9 h-9 mr-2"
            resizeMode="contain"
          />
          <View className="flex-1">
            <SearchBar
              placeholder="What are you looking for?"
              value={searchText}
              onChangeText={handleSearchChange}
            />
          </View>
        </View>
        <TouchableOpacity className="ml-2.5">
          <Ionicons name="notifications-outline" size={26} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Título + Filtro */}
      <View className="flex-row items-center justify-between mt-2 mb-2 px-5">
        <Text className="text-[22px] font-bold">Sports Events</Text>
        <TouchableOpacity
          className="bg-[#00D36C] rounded-full px-4 py-1.5 flex-row items-center"
          onPress={() => setFilterModalVisible(true)}
        >
          <Text className="text-white font-bold mr-1.5">Filter</Text>
          {activeFiltersCount > 0 ? (
            <View className="w-[22px] h-[22px] rounded-full bg-white items-center justify-center">
              <Text className="text-[#00D36C] font-bold text-[12px]">
                {activeFiltersCount}
              </Text>
            </View>
          ) : (
            <Ionicons name="filter" size={18} color="#fff" />
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
              image={DEFAULT_IMAGE}
              price={priceLabel(ev.price)}
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

      {/* Modal de avaliação */}
      <RatingModal
        visible={ratingModalVisible}
        onClose={() => setRatingModalVisible(false)}
        user={{ name: 'Stefane Brito' }}
        onSubmit={(rating, level, description) => {
          console.log('Avaliação enviada', { rating, level, description });
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
