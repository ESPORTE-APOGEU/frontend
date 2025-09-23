import React from "react";
import { View, Text } from "react-native";
import { Activity, ActivityItem } from "./ActivityItem";

export type ActivitiesSectionProps = {
  activities: Activity[];
  emptyText?: string;
};

export function ActivitiesSection({
  activities,
  emptyText = "Nenhuma atividade ainda",
}: ActivitiesSectionProps) {
  if (!activities || activities.length === 0) {
    return <Text className="px-7 text-[#969696] mt-4">{emptyText}</Text>;
  }

  return (
    <View className="mt-4">
      {activities.map((a) => (
        <ActivityItem key={a.id} item={a} />
      ))}
    </View>
  );
}
