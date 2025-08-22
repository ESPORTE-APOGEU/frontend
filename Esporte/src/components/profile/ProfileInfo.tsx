import React from "react";
import { View, Text, Image } from "react-native";

type InfoRowProps = {
  text: string;
  iconPath: any; // require caminho da imagem
};

const InfoRow = ({ text, iconPath }: InfoRowProps) => (
  <View className="flex-row items-center mb-2">
    <Image
      source={iconPath}
      style={{ width: 18, height: 18, marginRight: 8 }}
      resizeMode="contain"
    />
    <Text className="text-[16px] text-[#424242] font-semibold">{text}</Text>
  </View>
);

export const ProfileInfo = () => (
  <View className="px-7 mt-3">
    <InfoRow
      text="28 anos"
      iconPath={require("../../assets/images/calendar-icon.png")}
    />
    <InfoRow
      text="Goiânia, Goiás"
      iconPath={require("../../assets/images/pin-icon.png")}
    />
    <InfoRow
      text="Designer"
      iconPath={require("../../assets/images/job-icon.png")}
    />
  </View>
);
