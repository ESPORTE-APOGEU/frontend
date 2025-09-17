import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";

type Props = {
  date: Date;
  setDate: (date: Date) => void;
  startTime: Date;
  setStartTime: (date: Date) => void;
  endTime: Date;
  setEndTime: (date: Date) => void;
};

const timeLabel = (d: Date) =>
  `${d.getHours().toString().padStart(2, "0")} : ${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

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

  return (
    <View>
      <Text className="text-black font-medium text-[15px] mb-2">
        Calendário
      </Text>

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className="w-[238px] h-9 bg-white/75 border-b-[1.2px] border-[#43A047] rounded-[10px] px-4 flex-row items-center justify-between mb-3"
        style={styles.shadow}>
        <Text className="text-[#212121]">Dia do evento</Text>
        <Feather name="calendar" size={18} color="#212121" />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, d) => {
            setShowDatePicker(Platform.OS === "ios");
            if (d) setDate(d);
          }}
        />
      )}

      <View className="flex-row items-end gap-2 mb-3">
        <View>
          <Text className="text-black font-medium text-[15px] mb-1">
            Início
          </Text>
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            className="w-[127px] h-[39px] bg-white/75 border-b-[1.2px] border-[#43A047] rounded-lg px-4 justify-center"
            style={styles.shadow}>
            <Text className="text-[#212121]">{timeLabel(startTime)}</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text className="text-black font-medium text-[15px] mb-1">Fim</Text>
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            className="w-[127px] h-[39px] bg-white/75 border-b-[1.2px] border-[#43A047] rounded-lg px-4 justify-center"
            style={styles.shadow}>
            <Text className="text-[#212121]">{timeLabel(endTime)}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showStartPicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={(e, d) => {
            setShowStartPicker(Platform.OS === "ios");
            if (d) setStartTime(d);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={(e, d) => {
            setShowEndPicker(Platform.OS === "ios");
            if (d) setEndTime(d);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shadow:
    Platform.OS === "ios"
      ? {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
        }
      : { elevation: 4 },
});
