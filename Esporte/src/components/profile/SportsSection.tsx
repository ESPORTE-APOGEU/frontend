// components/profile/SportsSection.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import { SportCard } from "./SportCard";

export const SportsSection = ({
  sports,
  perSportLevel,
  onAddSport,
  onRemoveSport,
}: {
  sports: string[];
  perSportLevel?: Record<string, number>; // média 0..3 por esporte
  onAddSport?: (sport: string) => void;
  onRemoveSport?: (sport: string) => void;
}) => {
  const skillLabel = (avg?: number) => {
    if (avg == null) return "—";
    if (avg < 0.5) return "Iniciante";
    if (avg < 1.5) return "Intermediário";
    if (avg < 2.5) return "Avançado";
    return "Semiprofissional";
  };

  return (
    <View className="mt-6 px-7">
      <Text className="text-[24px] font-medium text-black">Esportes</Text>

      <View className="flex-row mt-3 flex-wrap gap-3">
        {sports.map((s) => (
          <Pressable key={s} onLongPress={() => onRemoveSport?.(s)}>
            <SportCard
              title={s}
              level={skillLabel(perSportLevel?.[s])}
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
