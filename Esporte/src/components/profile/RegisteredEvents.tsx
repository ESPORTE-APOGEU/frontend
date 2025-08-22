import React from "react";
import { View, ImageSourcePropType } from "react-native";
import EventCard from "../EventCard";

type RegisteredEvent = {
  id: string | number;
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
}: {
  events: RegisteredEvent[];
  onPressEvent?: (ev: RegisteredEvent) => void;
}) {
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
          onPress={onPressEvent ? () => onPressEvent(ev) : undefined}
        />
      ))}
    </View>
  );
}
