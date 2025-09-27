import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onFilter?: (filter: any) => void;
}

// opções mostradas em “Modalidade”
const sportsOptions = [
  'Futebol',
  'Vôlei',
  'Basquete',
  'Yoga',
  'Corrida',
  'Tênis',
  'Beach Tennis',
  'Futevôlei',
  'Pilates',
  'Paddle',
  'Pickleball',
];

const levels = ['Iniciante', 'Intermediário', 'Avançado', 'Semi-profissional'];
const genders = ['Masculino', 'Feminino', 'Misto'] as const;
type Gender = (typeof genders)[number];

const GREEN = '#43A047';
const GREEN_LIGHT = '#F7FFED';
const TEXT_PRIMARY = '#212121';
const TEXT_SECONDARY = '#263238';
const CHIP_BORDER = 'rgba(0,0,0,0.5)';

// ícone por esporte
function sportIconName(label: string): keyof typeof MaterialCommunityIcons.glyphMap {
  const l = label.toLowerCase();
  if (l.includes('futebol')) return 'soccer';
  if (l.includes('vôlei') || l.includes('volei')) return 'volleyball';
  if (l.includes('basquete')) return 'basketball';
  if (l.includes('yoga') || l.includes('pilates')) return 'yoga';
  if (l.includes('corrida')) return 'run';
  if (l.includes('tênis') || l.includes('tenis')) return 'tennis';
  if (l.includes('beach')) return 'tennis-ball';
  if (l.includes('futevôlei') || l.includes('futevolei')) return 'volleyball';
  if (l.includes('paddle') || l.includes('pickle')) return 'tennis-ball';
  return 'dumbbell';
}

const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onFilter }) => {
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);

  const [distance, setDistance] = useState<number>(0);
  const [locMode, setLocMode] = useState<'home' | 'current'>('home');

  const [dateObj, setDateObj] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [startTime, setStartTime] = useState<Date>(new Date(new Date().setHours(0, 0, 0, 0)));
  const [endTime, setEndTime] = useState<Date>(new Date(new Date().setHours(0, 0, 0, 0)));
  const [selectedTimeRange, setSelectedTimeRange] = useState<'manha' | 'tarde' | 'noite' | null>(null);

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const isTimeFilterActive = selectedTimeRange !== null;

  const toggleSport = (s: string) => {
    setSelectedSports((curr) => (curr.includes(s) ? curr.filter((x) => x !== s) : [...curr, s]));
  };

  const askCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    try {
      const pos = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
    } catch {
      setLocation(null);
    }
  };

  const handleFilterPress = () => {
    const filter: any = {};
    if (selectedSports.length > 0) filter.sports = selectedSports;
    if (selectedLevel) filter.levels = [selectedLevel];
    if (selectedGender) filter.gender = selectedGender;
    if (dateObj) filter.date = dateObj.toISOString().split('T')[0];
    if (isTimeFilterActive) {
      const sh = String(startTime.getHours()).padStart(2, '0');
      const sm = String(startTime.getMinutes()).padStart(2, '0');
      const eh = String(endTime.getHours()).padStart(2, '0');
      const em = String(endTime.getMinutes()).padStart(2, '0');
      filter.startTime = `${sh}:${sm}`;
      filter.endTime = `${eh}:${em}`;
    }
    if (distance > 0) {
      filter.maxDistanceKm = distance;
      if (locMode === 'current' && location) {
        filter.latitude = location.latitude;
        filter.longitude = location.longitude;
      }
    }
    onFilter?.(filter);
    onClose();
  };

  const handleClearFilter = () => {
    setSelectedSports([]);
    setSelectedLevel(null);
    setSelectedGender(null);
    setDistance(0);
    setLocMode('home');
    setLocation(null);
    setDateObj(undefined);
    setStartTime(new Date(new Date().setHours(0, 0, 0, 0)));
    setEndTime(new Date(new Date().setHours(0, 0, 0, 0)));
    setSelectedTimeRange(null);
    onFilter?.(null);
    onClose();
  };

  const selectLocMode = async (mode: 'home' | 'current') => {
    setLocMode(mode);
    if (mode === 'current') await askCurrentLocation();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <View
          style={{
            backgroundColor: GREEN_LIGHT,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 18,
            paddingBottom: 16,
            maxHeight: '88%',
          }}
        >
          {/* “barra” de arrastar */}
          <View
            style={{
              alignSelf: 'center',
              width: 44,
              height: 4,
              borderRadius: 999,
              backgroundColor: 'rgba(0,0,0,0.15)',
              marginBottom: 8,
            }}
          />

          <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
            {/* Modalidade */}
            <View style={{ paddingHorizontal: 24, marginTop: 8 }}>
              <Text style={{ fontSize: 20, lineHeight: 30, color: TEXT_PRIMARY, fontWeight: '500' }}>
                Modalidade
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 12, gap: 12 }}
              >
                {sportsOptions.map((s) => {
                  const active = selectedSports.includes(s);
                  return (
                    <TouchableOpacity
                      key={s}
                      onPress={() => toggleSport(s)}
                      style={{
                        paddingHorizontal: 14,
                        height: 36,
                        borderRadius: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        borderWidth: active ? 0 : 0.6,
                        borderColor: active ? 'transparent' : CHIP_BORDER,
                        backgroundColor: active ? GREEN : 'transparent',
                        shadowColor: active ? '#000' : undefined,
                        shadowOpacity: active ? 0.25 : 0,
                        shadowRadius: active ? 4 : 0,
                        elevation: active ? 2 : 0,
                      }}
                    >
                      <MaterialCommunityIcons
                        name={sportIconName(s)}
                        size={14}
                        color={active ? '#FFFFFF' : TEXT_SECONDARY}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          lineHeight: 14,
                          fontWeight: '600',
                          color: active ? '#FFFFFF' : TEXT_SECONDARY,
                        }}
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Nível */}
            <View style={{ paddingHorizontal: 24, marginTop: 6 }}>
              <Text style={{ fontSize: 20, lineHeight: 30, color: TEXT_PRIMARY, fontWeight: '500', marginBottom: 8 }}>
                Nível
              </Text>

              <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                {levels.map((lvl) => {
                  const active = selectedLevel === lvl;
                  return (
                    <TouchableOpacity
                      key={lvl}
                      onPress={() => setSelectedLevel(selectedLevel === lvl ? null : lvl)}
                      style={{
                        paddingHorizontal: 16,
                        height: 36,
                        borderRadius: 10,
                        justifyContent: 'center',
                        borderWidth: active ? 0 : 0.5,
                        borderColor: active ? GREEN : TEXT_SECONDARY,
                        backgroundColor: active ? GREEN : 'transparent',
                        shadowColor: active ? '#000' : undefined,
                        shadowOpacity: active ? 0.25 : 0,
                        shadowRadius: active ? 4 : 0,
                        elevation: active ? 2 : 0,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          lineHeight: 14,
                          fontWeight: '600',
                          color: active ? '#FFFFFF' : TEXT_SECONDARY,
                        }}
                      >
                        {lvl}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Gênero */}
            <View style={{ paddingHorizontal: 24, marginTop: 14 }}>
              <Text style={{ fontSize: 20, lineHeight: 30, color: TEXT_PRIMARY, fontWeight: '500', marginBottom: 8 }}>
                Gênero
              </Text>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                {genders.map((g) => {
                  const active = selectedGender === g;
                  return (
                    <TouchableOpacity
                      key={g}
                      onPress={() => setSelectedGender(selectedGender === g ? null : g)}
                      style={{
                        paddingHorizontal: 16,
                        height: 36,
                        borderRadius: 10,
                        justifyContent: 'center',
                        borderWidth: active ? 0 : 0.5,
                        borderColor: active ? GREEN : TEXT_SECONDARY,
                        backgroundColor: active ? GREEN : 'transparent',
                        shadowColor: active ? '#000' : undefined,
                        shadowOpacity: active ? 0.25 : 0,
                        shadowRadius: active ? 4 : 0,
                        elevation: active ? 2 : 0,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          lineHeight: 14,
                          fontWeight: '600',
                          color: active ? '#FFFFFF' : TEXT_SECONDARY,
                        }}
                      >
                        {g}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Distância */}
            <View style={{ paddingHorizontal: 24, marginTop: 18 }}>
              <Text style={{ fontSize: 20, lineHeight: 30, color: TEXT_PRIMARY, fontWeight: '500', marginBottom: 10 }}>
                Distância
              </Text>

              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                {/* Casa */}
                <TouchableOpacity
                  onPress={() => selectLocMode('home')}
                  style={{
                    paddingHorizontal: 16,
                    height: 23,
                    borderRadius: 10,
                    justifyContent: 'center',
                    backgroundColor: locMode === 'home' ? GREEN : 'transparent',
                    borderWidth: locMode === 'home' ? 0 : 0.5,
                    borderColor: TEXT_SECONDARY,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: locMode === 'home' ? '#FFFFFF' : TEXT_SECONDARY,
                    }}
                  >
                    Casa
                  </Text>
                </TouchableOpacity>

                {/* Localização atual */}
                <TouchableOpacity
                  onPress={() => selectLocMode('current')}
                  style={{
                    paddingHorizontal: 16,
                    height: 23,
                    borderRadius: 10,
                    justifyContent: 'center',
                    backgroundColor: locMode === 'current' ? GREEN : 'transparent',
                    borderWidth: locMode === 'current' ? 0 : 0.5,
                    borderColor: TEXT_SECONDARY,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: locMode === 'current' ? '#FFFFFF' : TEXT_SECONDARY,
                    }}
                  >
                    Localização atual
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'Filtro de Localização',
                      'Se a distância for maior que 0, a busca usa sua localização (ao escolher “Localização atual”).'
                    )
                  }
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: '#E0E0E0',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: '#666', fontWeight: 'bold', fontSize: 14 }}>?</Text>
                </TouchableOpacity>
              </View>

              {/* valor da distância em verde (sem linha extra!) */}
              <Text style={{ color: '#40B843', fontSize: 12, marginBottom: 6 }}>
                {distance.toFixed(1)} Km
              </Text>

              {/* slider */}
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={0}
                maximumValue={50}
                value={distance}
                onValueChange={async (val) => {
                  setDistance(val);
                  if (locMode === 'current' && val > 0 && !location) {
                    await askCurrentLocation();
                  }
                }}
                minimumTrackTintColor={GREEN}
                maximumTrackTintColor="#E0E0E0"
                thumbTintColor={GREEN}
              />
            </View>

            {/* Calendário */}
            <View style={{ paddingHorizontal: 24, marginTop: 18, width:'70%' }}>
              <Text style={{ fontSize: 20, lineHeight: 30, color: TEXT_PRIMARY, fontWeight: '500', marginBottom: 10 }}>
                Calendário
              </Text>

              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={{
                  height: 36,
                  borderRadius: 10,
                  borderWidth: 0.5,
                  borderColor: 'rgba(41,45,50,0.7)',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: 12,
                  backgroundColor: 'transparent',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: dateObj ? TEXT_SECONDARY : 'rgba(41,45,50,0.7)',
                    fontWeight: '600',
                  }}
                >
                  {dateObj ? dateObj.toLocaleDateString('pt-BR') : 'Dia do evento'}
                </Text>
                <MaterialCommunityIcons
                    name="calendar-blank-outline"
                    size={18}
                    color={'rgba(41,45,50,0.7)'}
                  />            </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={dateObj || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_, selected) => {
                    setShowDatePicker(false);
                    if (selected) setDateObj(selected);
                  }}
                  minimumDate={new Date()}
                />
              )}
            </View>

            {/* Selecione seus horários */}
            <View style={{ paddingHorizontal: 24, marginTop: 20, marginBottom: 14 }}>
              <Text style={{ fontSize: 20, lineHeight: 30, color: TEXT_PRIMARY, fontWeight: '500', marginBottom: 8 }}>
                Selecione seus horários
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {/* Manhã */}
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ fontSize: 15, color: TEXT_PRIMARY, fontWeight: '300', marginBottom: 6 }}>
                    Manhã
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      const s = new Date(); s.setHours(6, 0, 0, 0);
                      const e = new Date(); e.setHours(11, 0, 0, 0);
                      setStartTime(s);
                      setEndTime(e);
                      setSelectedTimeRange('manha');
                    }}
                    style={{
                      height: 36,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      justifyContent: 'center',
                      borderWidth: selectedTimeRange === 'manha' ? 0 : 0.5,
                      borderColor: TEXT_SECONDARY,
                      backgroundColor: selectedTimeRange === 'manha' ? GREEN : 'transparent',
                      shadowColor: selectedTimeRange === 'manha' ? '#000' : undefined,
                      shadowOpacity: selectedTimeRange === 'manha' ? 0.25 : 0,
                      shadowRadius: selectedTimeRange === 'manha' ? 4 : 0,
                      elevation: selectedTimeRange === 'manha' ? 2 : 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: selectedTimeRange === 'manha' ? '#FFFFFF' : TEXT_SECONDARY,
                      }}
                    >
                      6:00 às 11:00
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Tarde */}
                <View style={{ flex: 1, marginHorizontal: 8 }}>
                  <Text style={{ fontSize: 15, color: TEXT_PRIMARY, fontWeight: '300', marginBottom: 6 }}>
                    Tarde
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      const s = new Date(); s.setHours(11, 0, 0, 0);
                      const e = new Date(); e.setHours(18, 0, 0, 0);
                      setStartTime(s);
                      setEndTime(e);
                      setSelectedTimeRange('tarde');
                    }}
                    style={{
                      height: 36,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      justifyContent: 'center',
                      borderWidth: selectedTimeRange === 'tarde' ? 0 : 0.5,
                      borderColor: TEXT_SECONDARY,
                      backgroundColor: selectedTimeRange === 'tarde' ? GREEN : 'transparent',
                      shadowColor: selectedTimeRange === 'tarde' ? '#000' : undefined,
                      shadowOpacity: selectedTimeRange === 'tarde' ? 0.25 : 0,
                      shadowRadius: selectedTimeRange === 'tarde' ? 4 : 0,
                      elevation: selectedTimeRange === 'tarde' ? 2 : 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: selectedTimeRange === 'tarde' ? '#FFFFFF' : TEXT_SECONDARY,
                      }}
                    >
                      11:00 às 18:00
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Noite */}
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={{ fontSize: 15, color: TEXT_PRIMARY, fontWeight: '300', marginBottom: 6 }}>
                    Noite
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      const s = new Date(); s.setHours(18, 0, 0, 0);
                      const e = new Date(); e.setHours(23, 0, 0, 0);
                      setStartTime(s);
                      setEndTime(e);
                      setSelectedTimeRange('noite');
                    }}
                    style={{
                      height: 36,
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      justifyContent: 'center',
                      borderWidth: selectedTimeRange === 'noite' ? 0 : 0.5,
                      borderColor: TEXT_SECONDARY,
                      backgroundColor: selectedTimeRange === 'noite' ? GREEN : 'transparent',
                      shadowColor: selectedTimeRange === 'noite' ? '#000' : undefined,
                      shadowOpacity: selectedTimeRange === 'noite' ? 0.25 : 0,
                      shadowRadius: selectedTimeRange === 'noite' ? 4 : 0,
                      elevation: selectedTimeRange === 'noite' ? 2 : 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: selectedTimeRange === 'noite' ? '#FFFFFF' : TEXT_SECONDARY,
                      }}
                    >
                      18:00 às 23:00
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Botão Limpar Filtro */}
            {/* Botão Limpar Filtro */}
            {(
              selectedSports.length > 0 ||
              dateObj ||
              selectedLevel != null ||
              selectedGender != null ||
              distance !== 0 ||
              selectedTimeRange
            ) && (
              <View style={{ paddingHorizontal: 24, marginTop: 6 }}>
                <TouchableOpacity
                  onPress={handleClearFilter}
                  style={{
                    backgroundColor: '#F0F0F0',
                    paddingVertical: 12,
                    borderRadius: 16,
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ color: GREEN, fontSize: 16, fontWeight: 'bold' }}>
                    Limpar filtro
                  </Text>
                </TouchableOpacity>
              </View>
            )}


            {/* Botão Filtrar */}
            <View style={{ paddingHorizontal: 24 }}>
              <TouchableOpacity
                onPress={handleFilterPress}
                style={{
                  height: 53,
                  borderRadius: 16,
                  backgroundColor: GREEN,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontSize: 24,
                    lineHeight: 36,
                    letterSpacing: 0.01,
                    fontWeight: '600',
                  }}
                >
                  Filtrar
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 8 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
