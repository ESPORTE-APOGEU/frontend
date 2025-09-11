import React from "react";
import { View, Text, Image } from "react-native";
import { Badge } from "../../components/ui/Badge";
import { Stat } from "../../components/ui/Stat";

export const ProfileHeader = () => {
  return (
    <View className="px-7 pt-6">
      <View className="flex-col">
        <View className="flex-row">
          <View className="w-[86px] h-[86px] rounded-full bg-neutral-300 overflow-hidden mr-4 shadow">
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=47" }}
              className="w-full h-full"
            />
          </View>
          <View className="flex-row mt-4">
            <Stat value={144} label="Amigos" />
            <Stat value={12} label="Atividades" />
            <Stat value={2} label={"Atividades\nCriadas"} />
          </View>
        </View>

        <View className="flex">
          <Text className="text-[24px] leading-7 font-medium text-black">
            Stefane Brito
          </Text>
          <View className="mt-2">
            <Badge label="4.80" />
          </View>
        </View>
      </View>
    </View>
  );
};
