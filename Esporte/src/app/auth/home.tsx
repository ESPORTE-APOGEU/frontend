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
    const token = await getToken({ template: 'backend' });
    if (!token) throw new Error('Não foi possível obter o token JWT.');
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    };
    if (withJsonContentType) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://192.168.100.89:8080/api/v1/events');
      console.log('Fetched events:', res.data);
      setEvents(res.data);
    } catch (err: any) {
      setEvents([]);
      setError(err?.message || 'Erro ao conectar ao backend');
    }
    setLoading(false);
  };

  const handleFilter = async (filter: any) => {
    setLoading(true);
    setError(null);

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

    try {
      if (filter === null) {
        setActiveFiltersCount(0);
        await fetchEvents();
        return;
      }
      setActiveFiltersCount(computeFilterCount(filter));
      const res = await axios.post('http://192.168.100.89:8080/api/v1/events/filter', filter);
      setEvents(res.data);
    } catch (err: any) {
      setEvents([]);
      setError(err?.message || 'Erro ao conectar ao backend');
    }
    setLoading(false);
  };

  const debouncedSearch = React.useRef(
    debounce(async (text: string) => {
      setLoading(true);
      setError(null);
      try {
        if (!text.trim()) {
          await fetchEvents();
          return;
        }
        const res = await axios.get('http://192.168.100.89:8080/api/v1/events/search', {
          params: { q: text }
        });
        setEvents(res.data);
      } catch (err: any) {
        setEvents([]);
        setError(err?.message || 'Erro ao conectar ao backend');
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

  useEffect(() => {
    // só tenta buscar depois do Clerk carregar e se estiver logado
    if (!isLoaded) return;
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
        await fetchEvents();
        return;
      }
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
          // Remova o filtro local, apenas renderize os eventos recebidos
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
          <Text style={{ textAlign: 'center', marginTop: 40 }}>Carregando eventos...</Text>
        ) : error ? (
          <View style={{ marginTop: 40 }}>
            <Text style={{ textAlign: 'center', color: 'red' }}>Erro: {error}</Text>
          </View>
        ) : events.length === 0 ? (
          <View style={{ marginTop: 40 }}>
            <Text style={{ textAlign: 'center' }}>Nenhum evento encontrado.</Text>
            <Text style={{ fontSize: 12, color: '#888', marginTop: 10, textAlign: 'center' }}>Debug: {JSON.stringify(events)}</Text>
          </View>
        ) : (
          events
            .filter(event => {
              if (!searchText.trim()) return true;
              const txt = searchText.toLowerCase();
              return (
                event.name.toLowerCase().includes(txt) ||
                event.location.toLowerCase().includes(txt)
              );
            })
            .map((event) => {
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
        onClose={() => setRatingModalVisible(false)}
        user={{ name: 'Stefane Brito' }}
        onSubmit={(rating, level, description) => {
          console.log('Avaliação enviada', { rating, level, description });
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