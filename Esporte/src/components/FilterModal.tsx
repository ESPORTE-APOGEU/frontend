import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, Platform, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { OptionSelector } from './OptionSelector';


interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onFilter?: (filter: any) => void;
}

const sportsOptions = ['Futebol', 'Basquete', 'Vôlei', 'Tênis', 'Handebol', 'Corrida', 'Natação'];

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onFilter }) => {
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('Iniciante');
  const [distance, setDistance] = useState<number>(0);
  const [eventDate, setEventDate] = useState<string>('');
  const [startTime, setStartTime] = useState<Date>(new Date(new Date().setHours(0,0,0,0)));
  const [endTime, setEndTime] = useState<Date>(new Date(new Date().setHours(0,0,0,0)));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateObj, setDateObj] = useState<Date | undefined>(undefined);
  const [showSportsDropdown, setShowSportsDropdown] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string | null>(null);

  const levels = ['Iniciante', 'Intermediário', 'Avançado', 'Semi-profissional'];

  const removeSport = (sport: string) => {
    setSelectedSports(prev => prev.filter(s => s !== sport));
  };

  const addSport = (sport: string) => {
    if (!selectedSports.includes(sport)) {
      setSelectedSports(prev => [...prev, sport]);
    }
    setShowSportsDropdown(false);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateObj(selectedDate);
      const formatted = selectedDate.toLocaleDateString('pt-BR');
      setEventDate(formatted);
    }
  };

  // Função para buscar localização atual usando expo-location
  const handleToggleLocation = async () => {
    if (!useCurrentLocation) {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation(null);
        setUseCurrentLocation(false);
        return;
      }
      try {
        const pos = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setUseCurrentLocation(true);
      } catch (err) {
        setLocation(null);
        setUseCurrentLocation(false);
      }
    } else {
      setLocation(null);
      setUseCurrentLocation(false);
    }
  };

  // Helper para formatar horário
  const formatTime = (d: Date) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
  const isDefaultTime = (d: Date) => d.getHours() === 0 && d.getMinutes() === 0; // segundos/millis já zerados
  const isTimeFilterActive = selectedTimeRange !== null;

  // Função para montar o filtro e chamar o callback
  const handleFilterPress = () => {
    const filter: any = {};

    if (selectedSports.length > 0) filter.sports = selectedSports;
    if (selectedLevel && selectedLevel !== 'Iniciante') filter.levels = [selectedLevel];
    if (dateObj) filter.date = dateObj.toISOString().split('T')[0];
    if (isTimeFilterActive) {
      const sh = startTime.getHours().toString().padStart(2,'0');
      const sm = startTime.getMinutes().toString().padStart(2,'0');
      filter.startTime = `${sh}:${sm}`;
      const eh = endTime.getHours().toString().padStart(2,'0');
      const em = endTime.getMinutes().toString().padStart(2,'0');
      filter.endTime = `${eh}:${em}`;
    }
    if (distance > 0 && location) {
      filter.latitude = location.latitude;
      filter.longitude = location.longitude;
      filter.maxDistanceKm = distance;
    }

    console.log('Filtro enviado:', filter); // debug
    if (onFilter) onFilter(filter);
    onClose();
  };

  // Função para limpar filtro
  const handleClearFilter = () => {
    setSelectedSports([]);
    setSelectedLevel('Iniciante');
    setDistance(0);
    setEventDate('');
    setDateObj(undefined);
    const reset = new Date(new Date().setHours(0,0,0,0));
    setStartTime(reset);
    setEndTime(reset);
    setLocation(null);
    setSelectedTimeRange(null);
    if (onFilter) onFilter(null);
    onClose();
  };

  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end'
      }}>
        <View style={{
          backgroundColor: '#FDFFF9',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
          maxHeight: '80%',
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20
          }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000' }}>
              Sports Events
            </Text>
          </View>

          {/* Chips de filtros ativos */}
          
          {/* Fim chips de filtros ativos */}

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Esporte Section (usar visual do criarEvento) */}
            <View style={{ marginBottom: 20 }}>
              <OptionSelector
                title="Modalidade"
                options={sportsOptions}
                selectedValues={selectedSports}
                isMultiSelect={true}
                onSelect={(opt) => {
                  if (selectedSports.includes(opt)) setSelectedSports(prev => prev.filter(s => s !== opt));
                  else setSelectedSports(prev => [...prev, opt]);
                }}
              />
            </View>

            {/* Level Section (usar visual do criarEvento) */}
            <View style={{ marginBottom: 20 }}>
              <OptionSelector
                title="Nível"
                options={levels}
                selectedValues={selectedLevel}
                onSelect={(opt) => setSelectedLevel(opt)}
              />
            </View>

            {/* Distance Section */}
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', marginRight: 6 }}>
                  Distancia
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'Filtro de Localização',
                      'Se a distância for maior que 0, o filtro será feito com base na sua localização atual.'
                    )
                  }
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: '#E0E0E0',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 2
                  }}

                  activeOpacity={0.7}
                >
                  <Text style={{ color: '#666', fontWeight: 'bold', fontSize: 14 }}>?</Text>
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>{distance.toFixed(1)} km</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={50}
                value={distance}
                onValueChange={async (value) => {
                  setDistance(value);
                  if (value > 0 && !location) {
                    let { status } = await Location.requestForegroundPermissionsAsync();
                    if (status === 'granted') {
                      try {
                        const pos = await Location.getCurrentPositionAsync({});
                        setLocation({
                          latitude: pos.coords.latitude,
                          longitude: pos.coords.longitude,
                        });
                      } catch (err) {
                        setLocation(null);
                      }
                    }
                  }
                }}
                minimumTrackTintColor="#00D84A"
                maximumTrackTintColor="#E0E0E0"
              />
            </View>
            {/* Calendar Section */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
                Calendario
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={{
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 8,
                  padding: 12,
                  justifyContent: 'center'
                }}
              >
                <Text style={{ fontSize: 16, color: eventDate ? '#000' : '#888' }}>
                  {eventDate || 'Dia do evento'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={dateObj || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            {/* Time Selection: preset ranges (Manhã, Tarde, Noite) */}
            <View style={{ marginBottom: 30 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
                Selecione seus horarios
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {/** Manhã: 06:00 - 11:00 */}
                <View style={{ flex: 1, marginRight: 8, alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>Manhã</Text>
                  <TouchableOpacity
                    accessibilityLabel="Selecionar período Manhã"
                    onPress={() => {
                      const s = new Date(); s.setHours(6,0,0,0);
                      const e = new Date(); e.setHours(11,0,0,0);
                      setStartTime(s);
                      setEndTime(e);
                      setSelectedTimeRange('manha');
                    }}
                    style={{
                      width: '100%',
                      borderRadius: 8,
                      paddingVertical: 12,
                      alignItems: 'flex-start',
                      paddingLeft: 12,
                      borderWidth: selectedTimeRange === 'manha' ? 0 : 1,
                      borderColor: '#ddd',
                      backgroundColor: selectedTimeRange === 'manha' ? '#00D84A' : '#FDFFF9'
                    }}
                  >
                    <Text style={{ color: selectedTimeRange === 'manha' ? '#fff' : '#000' }}>6:00 às 11:00</Text>
                  </TouchableOpacity>
                </View>

                {/** Tarde: 11:00 - 18:00 */}
                <View style={{ flex: 1, marginHorizontal: 8, alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>Tarde</Text>
                  <TouchableOpacity
                    accessibilityLabel="Selecionar período Tarde"
                    onPress={() => {
                      const s = new Date(); s.setHours(11,0,0,0);
                      const e = new Date(); e.setHours(18,0,0,0);
                      setStartTime(s);
                      setEndTime(e);
                      setSelectedTimeRange('tarde');
                    }}
                    style={{
                      width: '100%',
                      borderRadius: 8,
                      paddingVertical: 12,
                      alignItems: 'flex-start',
                      paddingLeft: 12,
                      borderWidth: selectedTimeRange === 'tarde' ? 0 : 1,
                      borderColor: '#ddd',
                      backgroundColor: selectedTimeRange === 'tarde' ? '#00D84A' : '#FDFFF9'
                    }}
                  >
                    <Text style={{ color: selectedTimeRange === 'tarde' ? '#fff' : '#000' }}>11:00 às 18:00</Text>
                  </TouchableOpacity>
                </View>

                {/** Noite: 18:00 - 23:00 */}
                <View style={{ flex: 1, marginLeft: 8, alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>Noite</Text>
                  <TouchableOpacity
                    accessibilityLabel="Selecionar período Noite"
                    onPress={() => {
                      const s = new Date(); s.setHours(18,0,0,0);
                      const e = new Date(); e.setHours(23,0,0,0);
                      setStartTime(s);
                      setEndTime(e);
                      setSelectedTimeRange('noite');
                    }}
                    style={{
                      width: '100%',
                      borderRadius: 8,
                      paddingVertical: 12,
                      alignItems: 'flex-start',
                      paddingLeft: 12,
                      borderWidth: selectedTimeRange === 'noite' ? 0 : 1,
                      borderColor: '#ddd',
                      backgroundColor: selectedTimeRange === 'noite' ? '#00D84A' : '#FDFFF9'
                    }}
                  >
                    <Text style={{ color: selectedTimeRange === 'noite' ? '#fff' : '#000' }}>18:00 às 23:00</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* Botão Limpar Filtro */}
            {(selectedSports.length > 0 || eventDate || selectedLevel !== 'Iniciante' || distance !== 0 || isTimeFilterActive) && (

              <TouchableOpacity
                style={{
                  backgroundColor: '#F0F0F0',
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginBottom: 10
                }}
                onPress={handleClearFilter}
              >
                <Text style={{ color: '#00D84A', fontSize: 16, fontWeight: 'bold' }}>
                  Limpar Filtro
                </Text>
              </TouchableOpacity>
            )}
            {/* Filter Button */}
            <TouchableOpacity
              style={{
                backgroundColor: '#00D84A',
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center',
                marginBottom: 10
              }}
              onPress={handleFilterPress}
            >
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                Filtrar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;