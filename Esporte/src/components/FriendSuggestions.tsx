import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from "react-native";

export type Suggestion = {
  id: string;
  name: string;
  avatar?: string | null;      // URL do sugerido
  mutualCount: number;         // quantidade de amigos em comum
  mutualAvatars?: string[];    // URLs dos amigos em comum (até 3)
};

interface Props {
  suggestions: Suggestion[];
  onConnect: (receiverId: string) => void;
  onOpenProfile: (userId: string) => void;
}

export function FriendSuggestions({ suggestions, onConnect, onOpenProfile }: Props) {
  const fallback = require("../assets/images/Calendar.png");
  const mutualFallback = require("../assets/images/Criador.png");

  return (
    <>
      <Text style={styles.sectionTitle}>Sugestão de amigos</Text>

      {suggestions.map((s) => (
        <View key={s.id} style={styles.row}>
          <TouchableOpacity
            style={styles.touchRow}
            activeOpacity={0.7}
            onPress={() => onOpenProfile(s.id)}
          >
            <Image source={s.avatar ? { uri: s.avatar } : fallback} style={styles.avatar} />

            {/* Linha com: [Nome] --------- [Avatares + número] */}
            <View style={styles.middle}>
              <Text style={styles.name} numberOfLines={1}>
                {s.name}
              </Text>

              <View style={styles.mutualRight}>
                <View style={styles.mutualAvatarsWrap}>
                  {(s.mutualAvatars ?? []).slice(0, 3).map((url, i) => {
                    const src: ImageSourcePropType = url ? { uri: url } : mutualFallback;
                    return (
                      <Image
                        key={`${s.id}-m-${i}`}
                        source={src}
                        style={[
                          styles.mutualAvatar,
                          i > 0 ? { marginLeft: -8, zIndex: 10 - i } : { zIndex: 12 },
                        ]}
                      />
                    );
                  })}
                </View>
                <Text style={styles.countText}>{s.mutualCount}</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* botão verde “Adicionar” 96x28 radius 10.5, Poppins 12 branco */}
          <TouchableOpacity style={styles.addBtn} onPress={() => onConnect(s.id)}>
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
  touchRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
  // container que separa nome (esquerda) e avatares+contador (direita)
  middle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 34,
  },
  name: {
    color: "#000",
    fontFamily: "SF Pro",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 19,
    flexShrink: 1,          // evita quebrar linha
    paddingRight: 8,        // respiro antes dos avatares
  },
  mutualRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  mutualAvatarsWrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  mutualAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#FFF",
    backgroundColor: "#EAEAEA",
  },
  countText: {
    color: "#000",
    fontFamily: "SF Pro",
    fontWeight: "400",
    fontSize: 20,
    lineHeight: 24,
    marginLeft: 8,
  },
  addBtn: {
    width: 96,
    height: 28,
    borderRadius: 10.5,
    backgroundColor: "#43A047",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  addBtnText: {
    color: "#FFF",
    fontFamily: "Poppins",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 18,
  },
});
