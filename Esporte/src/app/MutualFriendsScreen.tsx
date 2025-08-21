// src/app/public/MutualFriendsScreen.tsx
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

type P = {
  id?: string;
  name?: string;
  mutualCount?: string;
  avatar?: string;
  friends?: string;
};

export default function MutualFriendsScreen() {
  const router = useRouter();
  const { name, mutualCount } = useLocalSearchParams<P>();
  const list: FriendRowData[] = [];

  return (
    <SafeAreaView className="flex-1 bg-[#F7FFED]">
      <View className="px-4 pt-2">
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
      <ScrollView className="px-4 mt-6">
        {list.map((f) => (
          <FriendRow key={f.id} data={f} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
