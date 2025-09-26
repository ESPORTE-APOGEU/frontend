import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export type Request = {
  id: string;
  name: string;
  avatar?: string | null;   // URL
  mutualCount?: number;     // opcional
};

interface Props {
  requests: Request[];
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export function FriendRequests({ requests, onAccept, onReject }: Props) {
  const fallback = require("../assets/images/Calendar.png"); // fallback local

  return (
    <>

      {requests.map((r) => (
        <View key={r.id} style={styles.row}>
          {/* avatar 43x43 com leve sombra */}
          <Image
            source={r.avatar ? { uri: r.avatar } : fallback}
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{r.name}</Text>

            {!!r.mutualCount && r.mutualCount > 0 && (
              <Text style={styles.mutualText}>
                {r.mutualCount} amigos em comum
              </Text>
            )}
          </View>

          {/* botões pequenos “quadradinhos” (32x32) com borda verde, como no figma */}

          <TouchableOpacity
            style={[styles.squareBtn, styles.squareBtnOutline]}
            onPress={() => onAccept(r.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="check" size={14} color="rgba(16,207,101,0.76)" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.squareBtn, styles.squareBtnOutline]}
            onPress={() => onReject(r.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="x" size={14} color="rgba(16,207,101,0.76)" />
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
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 28,
    marginBottom: 12,
    paddingVertical: 8,
  },
  avatar: {
    width: 43,
    height: 43,
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
  mutualText: {
    marginTop: 4,
    color: "rgba(41,45,50,0.7)",
    fontFamily: "SF Pro",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 17,
  },
  squareBtn: {
    width: 32,
    height: 32,
    borderRadius: 11.3,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    backgroundColor: "transparent",
  },
  squareBtnOutline: {
    borderWidth: 0.56,
    borderColor: "rgba(16,207,101,0.76)",
  },
});
