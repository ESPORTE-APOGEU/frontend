import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, RefreshControl, Alert } from "react-native";
import { useAuth } from "@clerk/clerk-expo"; // Importa o hook de autenticação

import SearchBar from "../components/SearchBar";
import { FriendRequests, Request } from "../components/FriendRequests";
import BottomNavigation from "../components/FutterBar";
import { FriendSuggestions, Suggestion } from "../components/FriendSuggestions";
import { getPendingRequests, respondToRequest, createFriendRequest } from "../services/FriendRequestService";
import { getFriendSuggestions } from "../services/FriendSuggestionService";
import {flattenArray} from "expo-router/vendor/react-helmet-async/lib/utils";
import { attachAuth } from "@/src/services/Api"; // <-- traga isto também


export default function FriendsScreen() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    // mesma ideia do Notificacoes
    attachAuth(() => getToken({ template: "backend", skipCache: true }));
  }, [getToken]);
  
  // Mantido: sua função original para buscar solicitações, agora usando o serviço atualizado
  const fetchPendingRequests = async () => {
    try {
      console.log('teste');
      const data = await getPendingRequests(); // Não precisa mais de ID
      console.log(data);
      const formattedData = data.map((req: any) => ({
        id: req.id,
        name: req.sender?.name || "Nome não informado",
        avatar: req.sender?.photo || "iconedocaba",
        mutualCount: 0,
        mutualAvatars: []
      }));
      setRequests(formattedData);
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
      Alert.alert("Erro", "Não foi possível carregar as solicitações de amizade.");
    }
  };

  // Mantido: sua função original para buscar sugestões, agora usando o serviço atualizado
  const fetchFriendSuggestions = async () => {
    try {
      const data = await getFriendSuggestions();
      const formattedData = data.map((sug: any) => ({
        id: sug.id,
        name: sug.name || "Usuário",
        avatar: sug.photo || "default_avatar_url", // Use um avatar padrão
        mutualCount: sug.mutualCount || 0,
        mutualInfo: sug.mutualCount > 0 ? `${sug.mutualCount} esporte(s) em comum` : "Nenhum esporte em comum",
      }));
      setSuggestions(formattedData);
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
      Alert.alert("Erro", "Não foi possível carregar as sugestões de amizade.");
    }
  };

  const onRefresh = useCallback(async () => {
    if (!isLoaded || !isSignedIn) return;   // <-- inclui isLoaded
    setRefreshing(true);
    await Promise.all([fetchPendingRequests(), fetchFriendSuggestions()]);
    setRefreshing(false);
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const handleAccept = async (requestId: string) => {
    try {
      await respondToRequest(requestId, "ACCEPTED");
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      console.error("Erro ao aceitar solicitação:", error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await respondToRequest(requestId, "REJECTED");
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (error) {
      console.error("Erro ao rejeitar solicitação:", error);
    }
  };

  const handleConnect = async (receiverId: string) => {
    try {
      await createFriendRequest(receiverId); // Não precisa mais do senderId
      setSuggestions((prev) => prev.filter((s) => s.id !== receiverId));
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
    }
  };

  const filteredRequests = requests.filter((r) =>
      (r.name || "").toLowerCase().includes(search.toLowerCase())
  );
  const filteredSuggestions = suggestions.filter((s) =>
      (s.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
      <SafeAreaView style={styles.container}>
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.searchRow}>
            <View style={{ flex: 1 }}>
              <SearchBar placeholder="Quem você procura" value={search} onChangeText={setSearch} />
            </View>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <FriendRequests requests={filteredRequests} onAccept={handleAccept} onReject={handleReject} />
          </View>
          <View style={styles.section}>
            <FriendSuggestions suggestions={filteredSuggestions} onConnect={handleConnect} />
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