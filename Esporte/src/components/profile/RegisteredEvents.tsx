import React from "react";
import { View, Text, ImageSourcePropType, TouchableOpacity } from "react-native";
import EventCard from "../EventCard";

type RegisteredEvent = {
  id: number;
  eventName: string;
  location: string;
  date: string;
  participants: number;
  image: ImageSourcePropType;
  price?: string;
};

export function RegisteredEvents({
  events,
  onPressEvent,
  emptyText = "Você não está inscrito em nenhum evento atualmente",
}: {
  events: RegisteredEvent[];
  onPressEvent?: (ev: RegisteredEvent) => void;
  emptyText?: string;
}) {
  if (!events || events.length === 0) {
    return <Text className="px-7 text-[#969696] mt-4">{emptyText}</Text>;
  }

  return (
    <View>
      {events.map((ev) => (
        <EventCard
          key={ev.id}
          eventName={ev.eventName}
          location={ev.location}
          date={ev.date}
          participants={ev.participants}
          image={ev.image}
          price={ev.price}
          onPress={() => onPressEvent?.(ev)}   // ← aqui
        />
      ))}
    </View>
  );
}
