// components/profile/SportsSection.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import { SportCard } from "./SportCard";

export const SportsSection = ({
  sports,
  onAddSport,
  onRemoveSport,
}: {
  sports: string[];
  onAddSport?: (sport: string) => void;
  onRemoveSport?: (sport: string) => void;
}) => {
  return (
    <View className="mt-6 px-7">
      <Text className="text-[24px] font-medium text-black">Esportes</Text>

      <View className="flex-row mt-3 flex-wrap gap-3">
        {sports.map((s) => (
          <Pressable key={s} onLongPress={() => onRemoveSport?.(s)}>
            <SportCard
              title={s}
              level="Iniciante"
              iconPath={require("../../assets/images/running-icon.png")}
            />
          </Pressable>
        ))}

        <Pressable onPress={() => onAddSport?.("Running")}>
          <SportCard
            title=""
            level=""
            highlight
            iconPath={require("../../assets/images/plus-icon.png")}
          />
        </Pressable>
      </View>
    </View>
  );
};