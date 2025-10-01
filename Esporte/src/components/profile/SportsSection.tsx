import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SportCard } from "./SportCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const SportsSection = ({
  sports,
  perSportLevel,
  onAddPress,        // mostra o botão +
  onRemoveSport,
}: {
  sports: string[];
  perSportLevel?: Record<string, number>;
  onAddPress?: () => void;
  onRemoveSport?: (sport: string) => void;
}) => {
  const skillLabel = (avg?: number) => {
    if (avg == null) return "—";
    if (avg < 0.5) return "Iniciante";
    if (avg < 1.5) return "Intermediário";
    if (avg < 2.5) return "Avançado";
    return "Semiprofissional";
  };

  // normaliza e mapeia só os esportes permitidos:
  // Futebol, Basquete, Vôlei, Natação, Corrida, Tennis, Corrirda(typo)
  const norm = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .trim();

  const iconFor = (sport: string): keyof typeof MaterialCommunityIcons.glyphMap => {
    const n = norm(sport);
    if (n.includes("futebol")) return "soccer";
    if (n.includes("basquete")) return "basketball";
    if (n.includes("volei")) return "volleyball";
    if (n.includes("natacao")) return "swim";
    if (n.includes("corrida") || n.includes("corrirda")) return "run";
    if (n.includes("tennis") || n.includes("tenis")) return "tennis";
    // fallback (caso venha algo fora da lista)
    return "dumbbell";
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Esportes</Text>

      <View style={styles.grid}>
        {sports.map((s) => {
          const body = (
            <View key={s} style={styles.cardWrap}>
              <SportCard
                title={s}
                level={skillLabel(perSportLevel?.[s])}
                iconName={iconFor(s)}
              />
            </View>
          );
          return onRemoveSport ? (
            <Pressable key={s} onLongPress={() => onRemoveSport?.(s)}>
              {body}
            </Pressable>
          ) : (
            body
          );
        })}

        {onAddPress && (
          <Pressable onPress={onAddPress} style={styles.cardWrap}>
            <SportCard title="" level="" highlight iconName="plus" />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginTop: 24, paddingHorizontal: 28 },
  title: { fontSize: 24, fontWeight: "600", color: "#000", marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", alignItems: "flex-start", marginTop: 4 },
  cardWrap: { marginRight: 12, marginBottom: 12 },
});
