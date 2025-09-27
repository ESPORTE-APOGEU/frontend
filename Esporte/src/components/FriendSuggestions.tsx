import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export type Suggestion = {
  id: string;
  name: string;
  avatar?: string | null; // URL
  mutualCount: number;
  mutualAvatars?: string[];
};

interface Props {
  suggestions: Suggestion[];
  onConnect: (receiverId: string) => void;
  onOpenProfile: (userId: string) => void;
}

export function FriendSuggestions({ suggestions, onConnect, onOpenProfile }: Props) {
  const fallback = require("../assets/images/Calendar.png");

  return (
    <>
      <Text style={styles.sectionTitle}>Sugestão de amigos</Text>

      {suggestions.map((s) => (
        <View key={s.id} style={styles.row}>
          <TouchableOpacity
            style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            activeOpacity={0.7}
            onPress={() => onOpenProfile(s.id)}
          >
            <Image source={s.avatar ? { uri: s.avatar } : fallback} style={styles.avatar}/>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{s.name}</Text>
            </View>
            <Text style={styles.countText}>{s.mutualCount}</Text>
          </TouchableOpacity>
          {/* botão verde “Adicionar” 96x28 radius 10.5, Poppins 12 branco */}
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => onConnect(s.id)}
          >
            <Text style={styles.addBtnText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: "#000",
    fontFamily: "Poppins",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 30,
    paddingLeft: 28,
    marginBottom: 8,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 28,
    marginBottom: 12,
    paddingVertical: 6,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 30,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: "#EAEAEA",
  },
  name: {
    color: "#000",
    fontFamily: "SF Pro",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 19,
  },
  countText: {
    color: "#000",
    fontFamily: "SF Pro",
    fontWeight: "400",
    fontSize: 20,
    lineHeight: 24,
    marginRight: 8,
  },
  addBtn: {
    width: 96,
    height: 28,
    borderRadius: 10.5,
    backgroundColor: "#43A047", // verde figma
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: {
    color: "#FFF",
    fontFamily: "Poppins",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 18,
  },
});
