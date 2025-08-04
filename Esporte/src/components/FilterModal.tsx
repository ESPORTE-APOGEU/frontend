import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
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
  const [distance, setDistance] = useState<number>(3.4);
  const [eventDate, setEventDate] = useState<string>('');
  const [startHour, setStartHour] = useState<string>('04');
  const [startMinute, setStartMinute] = useState<string>('50');
  const [endHour, setEndHour] = useState<string>('04');
  const [endMinute, setEndMinute] = useState<string>('50');
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

  // Função para montar o filtro e chamar o callback
  const handleFilterPress = () => {
    const filter = {
      latitude: useCurrentLocation && location ? location.latitude : null,
      longitude: useCurrentLocation && location ? location.longitude : null,
      maxDistanceKm: distance,
      sports: selectedSports,
      levels: [selectedLevel],
      date: dateObj ? dateObj.toISOString().split('T')[0] : null,
      startTime: `${startHour.padStart(2, '0')}:${startMinute.padStart(2, '0')}`,
      endTime: `${endHour.padStart(2, '0')}:${endMinute.padStart(2, '0')}`,
    };
    if (onFilter) onFilter(filter);
    onClose();
  };

  // Função para limpar filtro
  const handleClearFilter = () => {
    setSelectedSports([]);
    setSelectedLevel('Iniciante');
    setDistance(3.4);
    setEventDate('');
    setDateObj(undefined);
    setStartHour('04');
    setStartMinute('50');
    setEndHour('04');
    setEndMinute('50');
    setUseCurrentLocation(false);
    setLocation(null);
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
                <Text style={{ fontSize: 18, fontWeight: '600', marginRight: 10 }}>
                  Distancia
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: useCurrentLocation ? '#00D84A' : '#F0F0F0',
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 12
                  }}
                  onPress={handleToggleLocation}
                >
                  <Text style={{
                    color: useCurrentLocation ? '#fff' : '#666',
                    fontSize: 12
                  }}>
                    {useCurrentLocation ? 'Localização atual' : 'Localização atual'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>{distance.toFixed(1)} km</Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={50}
                value={distance}
                onValueChange={setDistance}
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 12,
                    width: 60,
                    textAlign: 'center',
                    marginRight: 8
                  }}
                  value={startHour}
                  onChangeText={setStartHour}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={{ marginRight: 8 }}>:</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 12,
                    width: 60,
                    textAlign: 'center',
                    marginRight: 20
                  }}
                  value={startMinute}
                  onChangeText={setStartMinute}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 12,
                    width: 60,
                    textAlign: 'center',
                    marginRight: 8
                  }}
                  value={endHour}
                  onChangeText={setEndHour}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <Text style={{ marginRight: 8 }}>:</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 12,
                    width: 60,
                    textAlign: 'center'
                  }}
                  value={endMinute}
                  onChangeText={setEndMinute}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
            </View>

            {/* Botão Limpar Filtro */}
            {(selectedSports.length > 0 || eventDate || selectedLevel !== 'Iniciante' || distance !== 3.4) && (
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