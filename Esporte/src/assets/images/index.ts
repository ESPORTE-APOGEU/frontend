// src/assets/images/index.ts
import { ImageSourcePropType } from "react-native";

export const images = {
  iconedocaba: require("./iconedocaba.png") as ImageSourcePropType,
  amigo1: require("./amigo1.png") as ImageSourcePropType,
  amigo2: require("./amigo2.png") as ImageSourcePropType,
  amigo3: require("./amigo3.png") as ImageSourcePropType,
  amizade: require("./amizade.png") as ImageSourcePropType,
} as const;
