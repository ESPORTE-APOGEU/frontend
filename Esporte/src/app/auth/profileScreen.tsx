// screens/profile/ProfileScreen.tsx
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileInfo } from "../../components/profile/ProfileInfo";
import { SportsSection } from "../../components/profile/SportsSection";
import { ActivitiesSection } from "../../components/profile/ActivitiesSection"; // se quiser manter
import BottomNavigation from "../../components/FutterBar";
import { ActionTabs, ActionTabKey } from "../../components/profile/ActionTabs";
import { RegisteredEvents } from "@/src/components/profile/RegisteredEvents";
import { FriendCard } from "@/src/components/profile/FriendCard";
import { Friends } from "@/src/components/profile/Friends";

export default function ProfileScreen() {
  const [tab, setTab] = useState<ActionTabKey>("participados");

  const renderTabContent = () => {
    switch (tab) {
      case "inscrito":
        return (
          <RegisteredEvents
            events={[
              {
                id: 1,
                eventName: "5x5 Soccer Night",
                location: "Marquina Park - Vila Mariana",
                date: "Monday, Feb 15, 2025",
                participants: 8,
                image: require("../../assets/images/tela.png"),
                price: "Free",
              },
              {
                id: 2,
                eventName: "Morning Run",
                location: "Lago das Rosas",
                date: "Tuesday, Feb 18, 2025",
                participants: 12,
                image: require("../../assets/images/tela.png"),
                price: "$5",
              },
            ]}
            onPressEvent={(ev) => console.log("Abrir detalhes:", ev.id)}
          />
        );
      case "participados":
        return <ActivitiesSection />;
      case "amigos":
        return (
          <Friends
            friends={[
              {
                id: "1",
                name: "Diego Alcantara",
                city: "São Paulo",
                avatar: "user1",
                mutualAvatars: ["user2", "user3", "user1"],
                mutualCount: 4,
              },
              {
                id: "2",
                name: "Marina Rocha",
                city: "Goiânia",
                avatar: "user3",
                mutualAvatars: ["user1", "user2"],
                mutualCount: 3,
              },
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7FFED]">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <ProfileHeader />
        <ProfileInfo />

        <View className="mb-4">
          <SportsSection />
        </View>

        <ActionTabs value={tab} onChange={setTab} />

        <View className="px-7 mt-4">{renderTabContent()}</View>

        {/* Se quiser manter esta seção independente dos tabs */}
        {/* <ActivitiesSection /> */}

        <View className="mt-48">
          <BottomNavigation />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
