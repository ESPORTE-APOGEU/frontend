// src/screens/FriendsScreen.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import SearchBar from "../components/SearchBar";
import { FriendRequests, Request } from "../components/FriendRequests";
import BottomNavigation from "../components/FutterBar";
import { FriendSuggestions } from "../components/FriendSuggestions";

// Dados mock para solicitações
const mockRequests: Request[] = [
  {
    id: "1",
    name: "Diego Costa de Paula",
    avatar: "iconedocaba",
    city: "Goiânia, Goiás",
    role: "Designer",
  },
  {
    id: "2",
    name: "Maria Oliveira",
    avatar: "iconedocaba",
    city: "Goiânia, Goiás",
    role: "Designer",
  },
];

export default function FriendsScreen() {
  const [search, setSearch] = useState("");

  // Filtrar solicitações e sugestões com base na pesquisa
  const filteredRequests = mockRequests.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  // Supondo que o usuário logado tenha ID 1 (substitua pela lógica de autenticação)
  const loggedUserId = 1;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.searchRow}>
          <View style={{ flex: 1 }}>
            <SearchBar
              placeholder="Quem você procura"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <FriendRequests requests={filteredRequests} />
        </View>
        <View style={styles.section}>
          <FriendSuggestions loggedUserId={loggedUserId} />
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <BottomNavigation />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" },
  scrollContent: { paddingBottom: 120 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  cancelButton: { marginLeft: 12 },
  cancelText: { color: "#000", fontSize: 14 },
  section: { marginTop: 24 },
  bottomNav: { position: "absolute", bottom: 0, left: 0, right: 0 },
});
