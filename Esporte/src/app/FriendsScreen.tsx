// src/screens/FriendsScreen.tsx
import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import SearchBar from "../components/SearchBar";
import { FriendRequests, Request } from "../components/FriendRequests";
import {
  FriendSuggestions,
  Suggestion,
} from "../components/FriendSuggestions";

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

const mockSuggestions: Suggestion[] = [
  {
    id: "1",
    name: "Diego Alcantara",
    avatar: "iconedocaba",
    mutualCount: 4,
    mutualAvatars: ["amigo1", "amigo2", "amigo3"],
  },
  {
    id: "2",
    name: "Diego Alcantara",
    avatar: "iconedocaba",
    mutualCount: 6,
    mutualAvatars: ["amigo1", "amigo2", "amigo3"],
  },
  {
    id: "3",
    name: "Diego Alcantara",
    avatar: "iconedocaba",
    mutualCount: 4,
    mutualAvatars: ["amigo1", "amigo2", "amigo3"],
  },
  {
    id: "4",
    name: "Diego Alcantara",
    avatar: "iconedocaba",
    mutualCount: 6,
    mutualAvatars: ["amigo1", "amigo2", "amigo3"],
  },
];

export default function FriendsScreen() {
  const [search, setSearch] = useState("");
  const filteredRequests = mockRequests.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredSuggestions = mockSuggestions.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <ScrollView className="flex-1 bg-[#F2F2F2]">
      <View className="flex-row items-center px-4 pt-6">
        <View className="flex-1">
          <SearchBar
            placeholder="Quem você procura"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity className="ml-3">
          <Text className="text-black text-[14px]">Cancel</Text>
        </TouchableOpacity>
      </View>
      <View className="mt-6">
        <FriendRequests requests={filteredRequests} />
      </View>
      <View className="mt-4">
        <FriendSuggestions suggestions={filteredSuggestions} />
      </View>
    </ScrollView>
  );
}
