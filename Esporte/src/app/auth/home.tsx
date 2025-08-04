import React, { useState } from 'react';
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
import { sportsEvents, SportEvent } from '../../Data/SportsEventsData';
import FilterModal from '../../components/FilterModal';

export default function Home() {
  const [searchText, setSearchText] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const handleEventPress = (eventId: string) => {
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
        {sportsEvents.map((event: SportEvent) => (
          <EventCard
            key={event.id}
            eventName={event.eventName}
            location={event.location}
            date={event.date}
            participants={event.participants}
            image={event.image}
            price={event.price}
            onPress={() => handleEventPress(event.id)}
          />
        ))}
      </ScrollView>

      {/* Modal de filtros */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
      />

      {/* Barra de navegação inferior */}
      <BottomNavigation />
    </SafeAreaView>
  );
}
