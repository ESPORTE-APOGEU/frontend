// components/profile/ProfileHeader.tsx
import React from "react";
import { View, Text, Image } from "react-native";
import { Badge } from "../../components/ui/Badge";
import { Stat } from "../../components/ui/Stat";

export const ProfileHeader = ({
  name,
  photoUrl,
  rating = "5.0",
  stats = { friends: 0, activities: 0, createdActivities: 0 },
}: {
  name: string;
  photoUrl?: string;
  rating?: string;
  stats?: { friends: number; activities: number; createdActivities: number };
}) => {
  return (
    <View className="px-7 pt-6">
      <View className="flex-col">
        <View className="flex-row">
          <View className="w-[86px] h-[86px] rounded-full bg-neutral-300 overflow-hidden mr-4 shadow">
            {photoUrl ? (
              <Image source={{ uri: photoUrl }} className="w-full h-full" />
            ) : (
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=47" }}
                className="w-full h-full"
              />
            )}
          </View>
          <View className="flex-row mt-4">
            <Stat value={stats.friends} label="Amigos" />
            <Stat value={stats.activities} label="Atividades" />
            <Stat
              value={stats.createdActivities}
              label={"Atividades\nCriadas"}
            />
          </View>
        </View>

        <View className="flex">
          <Text className="text-[24px] leading-7 font-medium text-black">
            {name}
          </Text>
          <View className="mt-2">
            <Badge label={rating} />
          </View>
        </View>
      </View>
    </View>
  );
};