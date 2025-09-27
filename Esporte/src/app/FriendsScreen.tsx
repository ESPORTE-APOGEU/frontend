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
import { useRouter } from "expo-router";


export default function FriendsScreen() {
  const router = useRouter();
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
        id: String(req.id),
        userId: req.sender?.id,
        name: req.sender?.name || "Nome não informado",
        avatar: req.sender?.photo || null,  // << URL vinda do back
        mutualCount: req.mutualCount ?? 0,
      }));
      setRequests(formattedData);
    } catch (error) {
      console.error("Erro ao buscar solicitações:", error);
      Alert.alert("Erro", "Não foi possível carregar as solicitações de amizade.");
    }
  };

   const openProfile = (userId: string) => {
    router.push({ pathname: "/auth/user/[id]", params: { id: userId } });
  };

  // Mantido: sua função original para buscar sugestões, agora usando o serviço atualizado
    const fetchFriendSuggestions = async () => {
      try {
        const data = await getFriendSuggestions();
        const formattedData = data.map((sug: any) => ({
          id: sug.id,
          name: sug.name || "Usuário",
          avatar: sug.avatar || null,          // << usar 'avatar' do back
          mutualCount: sug.mutualCount || 0,
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
      await respondToRequest(requestId, "ACCEPTED");
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    };

    const handleReject = async (requestId: string) => {
      await respondToRequest(requestId, "DECLINED"); // << era "REJECTED"
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
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
      {/* Search + Cancel (mesma estrutura, estilos ajustados) */}
      <View style={styles.searchRow} className="mt-14">
        <View style={{ flex: 1 }}>
          <SearchBar placeholder="Quem você procura" value={search} onChangeText={setSearch} />
        </View>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <FriendRequests requests={filteredRequests} onAccept={handleAccept} onReject={handleReject} onOpenProfile={openProfile} />
      </View>

      <View style={styles.section}>
        <FriendSuggestions suggestions={filteredSuggestions} onConnect={handleConnect} onOpenProfile={openProfile} />
      </View>
    </ScrollView>

    <View style={styles.bottomNav}>
      <BottomNavigation />
    </View>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FFED" }, // fundo do figma
  scrollContent: { paddingBottom: 120 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 28,    // margem esquerda de 28px como no figma
    paddingTop: 24,
  },
  cancelButton: { marginLeft: 12 },
  cancelText: {
    color: "#000",
    fontSize: 14,             // Poppins 14 no figma
    fontFamily: "Poppins",
  },
  section: { marginTop: 24 },
  bottomNav: {
    position: "absolute",
    left: 0, right: 0, bottom: 40,
    backgroundColor: "#FDFFF9",
    shadowColor: "rgba(13,10,44,0.06)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
    paddingTop: 6,
  },
});