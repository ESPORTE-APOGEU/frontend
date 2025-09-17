import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';
import EventCard from '../../components/EventCard';
import BottomNavigation from '../../components/FutterBar';
import axios from 'axios';
import FilterModal from '../../components/FilterModal';
import RatingModal from '../../components/RatingModal';
import ReportModal from '../../components/ReportModal';
import { debounce } from 'lodash';
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
  price: string;
  description: string;
}

const DEFAULT_IMAGE = require('../../assets/images/default_card.png');

export default function Home() {
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

  const getAuthHeaders = async (withJsonContentType = false) => {
    const token = await getToken({ template: 'backend' });
    if (!token) throw new Error('Não foi possível obter o token JWT.');
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };
    if (withJsonContentType) {
      headers['Content-Type'] = 'application/json';
    }
    console.log('Auth Headers:', headers);
    return headers;
  };

  useEffect(() => {
    // só tenta buscar depois do Clerk carregar e se estiver logado
    if (!isLoaded) return;
    if (!isSignedIn) {
      setEvents([]);
      setError('Você não está autenticado.');
      setPendingAvaliation(null);
      setRatingModalVisible(false);
      setJwtToken(null);
      return;
    }
    (async () => {
      const token = await getToken({ template: 'backend' });
      setJwtToken(token || null);
      fetchEvents();
      checkPendingAvaliation(token);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn]);

  const checkPendingAvaliation = async (token?: string | null) => {
    try {
      if (!token) return;
      const res = await fetch(
        process.env.EXPO_PUBLIC_BACKEND_URL + '/api/v1/avaliations/pending',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.length > 0) {
        setPendingAvaliation(data[0]);
        setRatingModalVisible(true);
      } else {
        setPendingAvaliation(null);
        setRatingModalVisible(false);
      }
    } catch (e) {
      setPendingAvaliation(null);
      setRatingModalVisible(false);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        process.env.EXPO_PUBLIC_BACKEND_URL + '/api/v1/events',
        { headers: await getAuthHeaders() }
      );
      setEvents(res.data);
    } catch (err: any) {
      setEvents([]);
      const msg =
        err?.response
          ? `Erro ${err.response.status}: ${
              typeof err.response.data === 'string'
                ? err.response.data
                : err.response.data?.message || 'Falha ao buscar eventos'
            }`
          : err?.message || 'Erro ao conectar ao backend';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const computeFilterCount = (f: any): number => {
    if (!f) return 0;
    let count = 0;
    if (f.sports && f.sports.length > 0) count += 1; 
    if (f.levels && f.levels.length > 0) count += 1; 
    if (f.date) count += 1; 
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
    setLoading(true);
    setError(null);
    try {
      if (filter === null) {
        setActiveFiltersCount(0);
        await fetchEvents();
        return;
      }
      setActiveFiltersCount(computeFilterCount(filter));
      const res = await axios.post(
        process.env.EXPO_PUBLIC_BACKEND_URL + '/api/v1/events/filter',
        filter,
        { headers: await getAuthHeaders(true) }
      );
      setEvents(res.data);
    } catch (err: any) {
      setEvents([]);
      const msg =
        err?.response
          ? `Erro ${err.response.status}: ${
              typeof err.response.data === 'string'
                ? err.response.data
                : err.response.data?.message || 'Falha ao filtrar eventos'
            }`
          : err?.message || 'Erro ao conectar ao backend';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = React.useRef(
    debounce(async (text: string) => {
      setLoading(true);
      setError(null);
      try {
        if (!isSignedIn) {
          setEvents([]);
          setError('Você não está autenticado.');
          setLoading(false);
          return;
        }
        if (!text.trim()) {
          await fetchEvents();
          return;
        }
        const res = await axios.get(
          process.env.EXPO_PUBLIC_BACKEND_URL + '/api/v1/events/search',
          {
            params: { q: text },
            headers: await getAuthHeaders(),
          }
        );
        setEvents(res.data);
      } catch (err: any) {
        setEvents([]);
        const msg =
          err?.response
            ? `Erro ${err.response.status}: ${
                typeof err.response.data === 'string'
                  ? err.response.data
                  : err.response.data?.message || 'Falha ao buscar eventos'
              }`
            : err?.message || 'Erro ao conectar ao backend';
        setError(msg);
      }
      setLoading(false);
    }, 500)
  ).current;

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleEventPress = (eventId: number) => {
    console.log('Event pressed:', eventId);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header superior */}
      <View className="mt-5 flex-row items-center justify-between px-4 pt-0 pb-0 bg-[#F8F9FA]">
        {/* Logo + SearchBar */}
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
        {/* Notificação */}
        <TouchableOpacity className="ml-2.5">
          <Ionicons name="notifications-outline" size={26} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Título e botão de filtro */}
      <View className="flex-row items-center justify-between mt-2 mb-2 px-5">
        <Text className="text-[22px] font-bold">Sports Events</Text>
        <TouchableOpacity
          className="bg-[#00D36C] rounded-full px-4 py-1.5 flex-row items-center"
          onPress={() => setFilterModalVisible(true)}
        >
          <Text className="text-white font-bold mr-1.5">Filter</Text>
          {activeFiltersCount > 0 ? (
            <View className="w-[22px] h-[22px] rounded-full bg-white items-center justify-center">
              <Text className="text-[#00D36C] font-bold text-[12px]">{activeFiltersCount}</Text>
            </View>
          ) : (
            <Ionicons name="filter" size={18} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Lista de eventos */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {loading ? (
          <Text className="text-center mt-10">Carregando eventos...</Text>
        ) : error ? (
          <View className="mt-10">
            <Text className="text-center text-red-600">Erro: {error}</Text>
          </View>
        ) : events.length === 0 ? (
          <View className="mt-10">
            <Text className="text-center">Nenhum evento encontrado.</Text>
            <Text className="text-[12px] text-gray-400 mt-2.5 text-center">Debug: {JSON.stringify(events)}</Text>
          </View>
        ) : (
          // Renderize os eventos recebidos
          events.map((event) => {
            let priceLabel = 'Grátis';
            if (event.price !== undefined && event.price !== null) {
              if (typeof event.price === 'number') {
                priceLabel = event.price > 0 ? `R$ ${event.price}` : 'Grátis';
              } else if (typeof event.price === 'string') {
                priceLabel = event.price !== '0.00' && event.price !== '0' ? `R$ ${event.price}` : 'Grátis';
              }
            }
            return (
              <EventCard
                key={event.id}
                eventName={event.name}
                location={event.location}
                date={event.date}
                participants={0}
                image={DEFAULT_IMAGE}
                price={priceLabel}
                onPress={() => handleEventPress(event.id)}
              />
            );
          })
        )}
      </ScrollView>

      {/* Modal de filtros */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onFilter={handleFilter}
      />

      {/* Modal de avaliação de usuário */}
      <RatingModal
        visible={ratingModalVisible}
        onClose={() => {
          setRatingModalVisible(false);
          setPendingAvaliation(null);
        }}
        user={pendingAvaliation ? { name: pendingAvaliation.toUserName, image: pendingAvaliation.toUserPhoto } : undefined}
        avaliationId={pendingAvaliation?.avaliationId}
        token={jwtToken || undefined}
        onSuccess={() => {
          setPendingAvaliation(null);
          setRatingModalVisible(false);
          checkPendingAvaliation(jwtToken);
        }}
        onError={(e) => {
          setPendingAvaliation(null);
          setRatingModalVisible(false);
          // Optionally show error toast
        }}
      />

      {/* Modal de report (visualização) */}
      <ReportModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        onSubmit={(reason, description) => {
          console.log('Report enviado', { reason, description });
        }}
      />

      {/* Barra de navegação inferior */}
      <BottomNavigation />
    </SafeAreaView>
  );
}