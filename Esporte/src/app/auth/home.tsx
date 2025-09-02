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
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    try {
      if (filter === null) {
        await fetchEvents();
        return;
      }
      const res = await axios.post('http://192.168.100.89:8080/api/v1/events/filter', filter);
      setEvents(res.data);
    } catch (err: any) {
      setEvents([]);
      setError(err?.message || 'Erro ao conectar ao backend');
    }
    setLoading(false);
  };

  const handleEventPress = (eventId: number) => {
    console.log('Event pressed:', eventId);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F8F9FA' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header superior */}
      <View style={{
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: '#F8F9FA'
      }}>
        {/* Logo + SearchBar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Image
            source={require('../../assets/images/logo_home.png')}
            style={{ width: 36, height: 36, marginRight: 8 }}
            resizeMode="contain"
          />
          <View style={{ flex: 1 }}>
            <SearchBar
              placeholder="What are you looking for?"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>
        {/* Notificação */}
        <TouchableOpacity style={{ marginLeft: 10 }}>
          <Ionicons name="notifications-outline" size={26} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Título e botão de filtro */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 8,
        paddingHorizontal: 20,
      }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Sports Events</Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#00D36C',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 6,
            flexDirection: 'row',
            alignItems: 'center'
          }}
          onPress={() => setFilterModalVisible(true)}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', marginRight: 6 }}>Filter</Text>
          <Ionicons name="filter" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Lista de eventos */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {loading ? (
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

      {/* Barra de navegação inferior */}
      <BottomNavigation />
    </SafeAreaView>
  );
}
