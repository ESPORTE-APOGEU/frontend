import { ImageSourcePropType } from "react-native";

export interface SportEvent {
  id: string;
  eventName: string;
  location: string;
  date: string;
  participants: number;
  image: ImageSourcePropType;
  price: string;
}

export const sportsEvents: SportEvent[] = [
  {
    id: "1",
    eventName: "Event Name",
    location: "Marquina Park - Vila Mariana",
    date: "Monday, Feb 15, 2025",
    participants: 2,
    image: require("../assets/images/default_card.png"),
    price: "Free"
  },
  {
    id: "2", 
    eventName: "Event Name",
    location: "Marquina Park - Vila Mariana", 
    date: "Monday, Feb 15, 2025",
    participants: 2,
    image: require("../assets/images/default_card.png"),
    price: "Free"
  },
  {
    id: "3",
    eventName: "Event Name", 
    location: "Marquina Park - Vila Mariana",
    date: "Monday, Feb 15, 2025", 
    participants: 2,
    image: require("../assets/images/default_card.png"),
    price: "Free"
  }
];

export default sportsEvents;
