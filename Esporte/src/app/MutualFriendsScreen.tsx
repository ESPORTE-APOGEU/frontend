import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import FriendRow, { FriendRowData } from "../components/ui/FriendRow";
import { images } from "../assets/images";

type P = {
  id?: string;
  name?: string;
  mutualCount?: string;
  avatar?: string;
  friends?: string;
};

const MOCK_ALL_USERS: Record<string, FriendRowData> = {
  amigo1: { id: "101", name: "Samara Santos", avatar: "amigo1" },
  amigo2: { id: "102", name: "Lucas Andrade", avatar: "amigo2" },
  amigo3: { id: "103", name: "Beatriz Lima", avatar: "amigo3" },
};

export default function MutualFriendsScreen() {
  const router = useRouter();
  const { name, mutualCount, friends } = useLocalSearchParams<P>();
  const mutualFriendKeys: string[] = friends ? JSON.parse(friends) : [];
  const list: FriendRowData[] = mutualFriendKeys
    .map((key) => MOCK_ALL_USERS[key])
    .filter(Boolean);

  return (
    <SafeAreaView className="flex-1 bg-[#F7FFED]">
      {/* Container principal com padding superior ajustado */}
      <View className="px-4 pt-10">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Feather name="chevron-left" size={24} color="#43A047" />
          </TouchableOpacity>
          <View className="px-6 py-3 bg-[#43A047] rounded-2xl shadow self-center">
            <Text className="text-white text-[20px] font-semibold">
              {name ?? ""}
            </Text>
          </View>
          <View className="w-8" />
        </View>
        <Text className="text-[#43A047] text-[16px] font-semibold text-center mt-2">
          {Number(mutualCount ?? 0)} amigos em comum
        </Text>
      </View>

      {/* ScrollView com margem superior aumentada */}
      <ScrollView className="px-4 mt-20">
        {list.map((friend) => (
          <FriendRow key={friend.id} data={friend} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
