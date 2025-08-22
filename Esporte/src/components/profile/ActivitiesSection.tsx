import React, { useMemo } from "react";
import { View } from "react-native";
import { Activity, ActivityItem } from "./ActivityItem";

export const ActivitiesSection = () => {
  const data = useMemo<Activity[]>(
    () => [
      {
        id: "1",
        title: "Grupo de Futebol",
        timeAgo: "Há 2 dias",
        tag: "Futebol",
        icon: "soccer", // Use the correct path to your icon
      },
      {
        id: "2",
        title: "Domingo de Yoga",
        timeAgo: "Há 2 dias",
        tag: "Yoga",
        icon: "yoga",
      },
    ],
    []
  );

  return (
    <View className="mt-4">
      {data.map((a) => (
        <ActivityItem key={a.id} item={a} />
      ))}
    </View>
  );
};
