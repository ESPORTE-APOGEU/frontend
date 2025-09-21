// src/screens/FriendsScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl
} from "react-native";
import SearchBar from "../components/SearchBar";
import { FriendRequests, Request } from "../components/FriendRequests";
import BottomNavigation from "../components/FutterBar";
import { FriendSuggestions, Suggestion } from "../components/FriendSuggestions";
import {
  getPendingRequests,
  respondToRequest,
  createFriendRequest,
} from "../services/FriendRequestService";
import { getFriendSuggestions } from "../services/FriendSuggestionService";
import axios from "axios";

export default function FriendsScreen() {
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const currentUserId = 2; // Usuário de teste

  // Função de recarregamento
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchPendingRequests(), fetchFriendSuggestions()]);
    setRefreshing(false);
  }, []);

  // Busca as solicitações pendentes do usuário com id currentUserId
  const fetchPendingRequests = async () => {
    try {
      const data = await getPendingRequests(currentUserId);
      // Mapeia os dados para o formato esperado, utilizando a lógica de amigos em comum:
      const formattedData = data.map((req: any) => ({
        id: req.id,
        name: req.sender?.name || "Nome não informado",
        avatar: req.sender?.photo || "iconedocaba",
        mutualCount: 0, // Se houver lógica para calcular amigos em comum, adicione aqui
        mutualAvatars: [] // Caso contrário, mantenha como vazio
      }));
      console.log("Dados formatados das solicitações:", formattedData);
      setRequests(formattedData);
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
    }
  };

  // Busca as sugestões de amizades do backend
  const fetchFriendSuggestions = async () => {
    try {
      const response = await axios.get(`http://192.168.100.10:8080/api/v1/friend-suggestions/${currentUserId}`);
      const data = response.data;
      console.log("Dados da API:", data);
      const formattedData = data.map((s: any) => ({
        id: s.id,
        name: s.name || "Nome não informado",
        avatar: s.avatar || "iconedocaba",
        mutualCount: s.mutualCount || 0,
        mutualAvatars: s.mutualAvatars || []
      }));
      console.log("Dados formatados das sugestões:", formattedData);
      setSuggestions(formattedData);
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
    fetchFriendSuggestions();
  }, []);

  const filteredRequests = requests.filter((r) =>
    (r.name || "").toLowerCase().includes(search.toLowerCase())
  );
  const filteredSuggestions = suggestions.filter((s) =>
    (s.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleAccept = async (requestId: number) => {
    try {
      await respondToRequest(requestId, "ACCEPTED");
      setRequests((prev) => prev.filter((r) => Number(r.id) !== requestId));
    } catch (error) {
      console.error("Erro ao aceitar solicitação:", error);
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await respondToRequest(requestId, "REJECTED");
      setRequests((prev) => prev.filter((r) => Number(r.id) !== requestId));
    } catch (error) {
      console.error("Erro ao rejeitar solicitação:", error);
    }
  };

  const handleConnect = async (receiverId: number) => {
    try {
      await createFriendRequest(currentUserId, receiverId);
      console.log("Solicitação enviada para o usuário", receiverId);
      // Opcional: atualiza as solicitações pós conexão
      fetchPendingRequests();
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
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
          <FriendRequests
            requests={filteredRequests}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        </View>
        <View style={styles.section}>
          <FriendSuggestions
            suggestions={filteredSuggestions}
            onConnect={handleConnect}
          />
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
