// Caminho: src/components/ui/PrivacyToggle.tsx
import React from "react";
import { View, Text, Switch, StyleSheet, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = {
  value: boolean;
  onValueChange: (v: boolean) => void;
};

export function PrivacyToggle({ value, onValueChange }: Props) {
  return (
    <View
      className="w-full h-12 bg-white/75 border-b-[1.2px] border-[#358838] rounded-lg px-4 flex-row items-center justify-between mb-3"
      style={styles.shadow}>
      <View className="flex-row items-center">
        <Text className="text-[#212121] mr-2">Privado</Text>
        <Feather name="info" size={14} color="#9E9E9E" />
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E0E0E0", true: "#C8E6C9" }}
        thumbColor={value ? "#10CF65" : "#f4f3f4"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  shadow:
    Platform.OS === "ios"
      ? {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
        }
      : { elevation: 3 },
});
