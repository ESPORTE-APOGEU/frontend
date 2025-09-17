

export const images = {
  Icon1: require("./fut.png"),
  Icon2: require("./volei.png"),
  Icon3: require("./basket.png"),
  Icon4: require("./yoga.png"),
};

import { ImageSourcePropType } from "react-native";

export const images = {
  iconedocaba: require("./participante.png") as ImageSourcePropType,
  amigo1: require("./amigo1.png") as ImageSourcePropType,
  amigo2: require("./amigo2.png") as ImageSourcePropType,
  amigo3: require("./amigo3.png") as ImageSourcePropType,
} as const;
