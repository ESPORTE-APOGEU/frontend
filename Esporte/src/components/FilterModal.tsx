import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, Platform, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';

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
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateObj, setDateObj] = useState<Date | undefined>(undefined);
  const [showSportsDropdown, setShowSportsDropdown] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

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
  const isTimeFilterActive = !(isDefaultTime(startTime) && isDefaultTime(endTime) && startTime.getTime() === endTime.getTime());

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
    if (onFilter) onFilter(null);
    onClose();
  };

  // Garantir que endTime não seja antes de startTime
  const onChangeStartTime = (_: any, selected?: Date) => {
    if (selected) {
      const adjusted = new Date(selected);
      // Normalizar segundos/milisegundos
      adjusted.setSeconds(0,0);
      setStartTime(adjusted);
      if (endTime < adjusted) {
        const newEnd = new Date(adjusted.getTime() + 60*60*1000); // +1h
        newEnd.setSeconds(0,0);
        setEndTime(newEnd);
      }
    }
    if (Platform.OS !== 'ios') setShowStartTimePicker(false);
  };
  const onChangeEndTime = (_: any, selected?: Date) => {
    if (selected) {
      const adjusted = new Date(selected);
      adjusted.setSeconds(0,0);
      if (adjusted < startTime) {
        setEndTime(startTime);
      } else {
        setEndTime(adjusted);
      }
    }
    if (Platform.OS !== 'ios') setShowEndTimePicker(false);
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
          backgroundColor: '#fff',
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
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
            {/* Esportes */}
            {selectedSports.map((sport, index) => (
              <View key={`chip-sport-${index}`} style={{
                backgroundColor: '#E8F5E8',
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginRight: 8,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Text style={{ color: '#00D84A', marginRight: 4 }}>{sport}</Text>
                <TouchableOpacity onPress={() => removeSport(sport)}>
                  <Text style={{ color: '#00D84A' }}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
            {/* Nível */}
            {selectedLevel !== 'Iniciante' && (
              <View style={{
                backgroundColor: '#E8F5E8',
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginRight: 8,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Text style={{ color: '#00D84A', marginRight: 4 }}>{selectedLevel}</Text>
                <TouchableOpacity onPress={() => setSelectedLevel('Iniciante')}>
                  <Text style={{ color: '#00D84A' }}>×</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* Data */}
            {dateObj && (
              <View style={{
                backgroundColor: '#E8F5E8',
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginRight: 8,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Text style={{ color: '#00D84A', marginRight: 4 }}>
                  {dateObj.toLocaleDateString('pt-BR')}
                </Text>
                <TouchableOpacity onPress={() => { setDateObj(undefined); setEventDate(''); }}>
                  <Text style={{ color: '#00D84A' }}>×</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* Distância */}
            {distance > 0 && (
              <View style={{
                backgroundColor: '#E8F5E8',
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginRight: 8,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Text style={{ color: '#00D84A', marginRight: 4 }}>
                  {distance.toFixed(1)} km
                </Text>
                <TouchableOpacity onPress={() => setDistance(0)}>
                  <Text style={{ color: '#00D84A' }}>×</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* Horário */}
            {isTimeFilterActive && (
              <View style={{
                backgroundColor: '#E8F5E8',
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginRight: 8,
                marginBottom: 8,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Text style={{ color: '#00D84A', marginRight: 4 }}>
                  {`${formatTime(startTime)} - ${formatTime(endTime)}`}
                </Text>
                <TouchableOpacity onPress={() => {
                  const reset = new Date(new Date().setHours(0,0,0,0));
                  setStartTime(reset);
                  setEndTime(reset);
                }}>
                  <Text style={{ color: '#00D84A' }}>×</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {/* Fim chips de filtros ativos */}

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Esporte Section */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
                Esporte
              </Text>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 8,
                  padding: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onPress={() => setShowSportsDropdown(!showSportsDropdown)}
              >
                <Text>Selecione seu esporte</Text>
                <Text>⌄</Text>
              </TouchableOpacity>
              {showSportsDropdown && (
                <View style={{
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  marginTop: 4,
                  zIndex: 10
                }}>
                  {sportsOptions.map((sport) => (
                    <TouchableOpacity
                      key={sport}
                      style={{
                        padding: 12,
                        backgroundColor: selectedSports.includes(sport) ? '#E8F5E8' : '#fff'
                      }}
                      onPress={() => addSport(sport)}
                      disabled={selectedSports.includes(sport)}
                    >
                      <Text style={{ color: selectedSports.includes(sport) ? '#00D84A' : '#000' }}>
                        {sport}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
                {selectedSports.map((sport, index) => (
                  <View key={index} style={{
                    backgroundColor: '#E8F5E8',
                    borderRadius: 16,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    marginRight: 8,
                    marginBottom: 8,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}>
                    <Text style={{ color: '#00D84A', marginRight: 4 }}>{sport}</Text>
                    <TouchableOpacity onPress={() => removeSport(sport)}>
                      <Text style={{ color: '#00D84A' }}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Level Section */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
                Level
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {levels.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={{
                      backgroundColor: selectedLevel === level ? '#00D84A' : '#F0F0F0',
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      marginRight: 8,
                      marginBottom: 8
                    }}
                    onPress={() => setSelectedLevel(level)}
                  >
                    <Text style={{
                      color: selectedLevel === level ? '#fff' : '#666',
                      fontSize: 12
                    }}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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

            {/* Time Selection */}
            <View style={{ marginBottom: 30 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 10 }}>
                Selecione seus horarios
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ fontSize: 14, color: '#555', marginBottom: 6 }}>Início</Text>
                  <TouchableOpacity
                    onPress={() => { setShowStartTimePicker(true); setShowEndTimePicker(false); }}
                    style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, alignItems: 'center' }}
                  >
                    <Text style={{ fontSize: 16 }}>{formatTime(startTime)}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={{ fontSize: 14, color: '#555', marginBottom: 6 }}>Fim</Text>
                  <TouchableOpacity
                    onPress={() => { setShowEndTimePicker(true); setShowStartTimePicker(false); }}
                    style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, alignItems: 'center' }}
                  >
                    <Text style={{ fontSize: 16 }}>{formatTime(endTime)}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {(showStartTimePicker || showEndTimePicker) && (
                <View style={{ marginTop: 16 }}>
                  {showStartTimePicker && (
                    <DateTimePicker
                      value={startTime}
                      mode="time"
                      is24Hour
                      display={Platform.OS === 'android' ? 'spinner' : 'spinner'}
                      onChange={onChangeStartTime}
                    />
                  )}
                  {showEndTimePicker && (
                    <DateTimePicker
                      value={endTime}
                      mode="time"
                      is24Hour
                      display={Platform.OS === 'android' ? 'spinner' : 'spinner'}
                      onChange={onChangeEndTime}
                    />
                  )}
                </View>
              )}
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