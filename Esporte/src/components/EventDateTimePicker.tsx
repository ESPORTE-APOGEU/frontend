import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, StyleSheet } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";

type Props = {
  date: Date;
  setDate: (date: Date) => void;
  startTime: Date;
  setStartTime: (date: Date) => void;
  endTime: Date;
  setEndTime: (date: Date) => void;
};

const fmt2 = (n: number) => n.toString().padStart(2, "0");
const timeLabel = (d: Date) => `${fmt2(d.getHours())}:${fmt2(d.getMinutes())}`;
const dateLabel = (d: Date) => `${fmt2(d.getDate())}/${fmt2(d.getMonth() + 1)}/${d.getFullYear()}`;

export function EventDateTimePicker({
  date,
  setDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // normaliza segundos/millis
  const normalizeHM = (base: Date, picked: Date) => {
    const d = new Date(base);
    d.setHours(picked.getHours(), picked.getMinutes(), 0, 0);
    return d;
  };

  const onChangeDate = (e: DateTimePickerEvent, d?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (e.type === "set" && d) {
      const nd = new Date(d);
      nd.setHours(0, 0, 0, 0);
      setDate(nd);
    }
  };

  const onChangeStart = (e: DateTimePickerEvent, d?: Date) => {
    if (Platform.OS === "android") setShowStartPicker(false);
    if (e.type === "set" && d) setStartTime(normalizeHM(startTime, d));
  };

  const onChangeEnd = (e: DateTimePickerEvent, d?: Date) => {
    if (Platform.OS === "android") setShowEndPicker(false);
    if (e.type === "set" && d) setEndTime(normalizeHM(endTime, d));
  };

  return (
    <View>
      <Text className="text-black font-medium text-[15px] mb-2">Calendário</Text>

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className="w-[238px] h-9 bg-white/75 border-b-[1.2px] border-[#43A047] rounded-[10px] px-4 flex-row items-center justify-between mb-3"
        style={styles.shadow}
      >
        <Text className="text-[#212121]">{dateLabel(date)}</Text>
        <Feather name="calendar" size={18} color="#212121" />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <View className="flex-row items-end gap-2 mb-3">
        <View>
          <Text className="text-black font-medium text-[15px] mb-1">Início</Text>
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            className="w-[127px] h-[39px] bg-white/75 border-b-[1.2px] border-[#43A047] rounded-lg px-4 justify-center"
            style={styles.shadow}
          >
            <Text className="text-[#212121]">{timeLabel(startTime)}</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text className="text-black font-medium text-[15px] mb-1">Fim</Text>
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            className="w-[127px] h-[39px] bg-white/75 border-b-[1.2px] border-[#43A047] rounded-lg px-4 justify-center"
            style={styles.shadow}
          >
            <Text className="text-[#212121]">{timeLabel(endTime)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          is24Hour
          onChange={onChangeStart}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          is24Hour
          onChange={onChangeEnd}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shadow:
    Platform.OS === "ios"
      ? { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 }
      : { elevation: 4 },
});
