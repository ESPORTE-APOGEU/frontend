import React from "react";
import { View, Text } from "react-native";
import { SportCard } from "./SportCard";

export const SportsSection = () => (
  <View className="mt-6 px-7">
    <Text className="text-[24px] font-medium text-black">Esportes</Text>
    <View className="flex-row mt-3">
      <SportCard
        title="Yoga"
        level="Iniciante"
        iconPath={require("../../assets/images/yoga-icon.png")}
      />
      <SportCard
        title="Soccer"
        level="Iniciante"
        iconPath={require("../../assets/images/soccer-icon.png")}
      />
      <SportCard
        title="Running"
        level="Iniciante"
        iconPath={require("../../assets/images/running-icon.png")}
      />
      <SportCard
        title=""
        level=""
        highlight
        iconPath={require("../../assets/images/plus-icon.png")}
      />
    </View>
  </View>
);
