import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function BottomNavigation() {
  const navigation = useNavigation();

  return (
    // Container principal (equivalente ao "Rectangle 69")
    <View className="absolute bottom-0 w-full bg-[#FAFAFA] shadow-lg h-24">
      <View className="flex-row justify-around items-center flex-1">
        {/* Item: Home */}
        <TouchableOpacity
          className="items-center"
          onPress={() => navigation.navigate("iiiiojn")}
        >
          <Image
            source={require("../assets/images/home.png")}
            className="w-6 h-6"
            resizeMode="contain"
          />
          <Text className="mt-1 text-[10px] font-medium text-center text-[#828282]">
            Home
          </Text>
        </TouchableOpacity>

        {/* Item: Exercícios */}
        <TouchableOpacity
          className="items-center"
          onPress={() => navigation.navigate("iiiiion")}
        >
          <Image
            source={require("../assets/images/exercicios.png")}
            className="w-6 h-6"
            resizeMode="contain"
          />
          <Text className="mt-1 text-[10px] font-medium text-center text-[#828282]">
            Exercícios
          </Text>
        </TouchableOpacity>

        {/* Item: Chatbot */}
        <TouchableOpacity
          className="items-center"
          onPress={() => navigation.navigate("public/chatScreen")}
        >
          <Image
            source={require("../assets/images/chatbot.png")}
            className="w-6 h-6"
            resizeMode="contain"
          />
          <Text className="mt-1 text-[10px] font-medium text-center text-[#1C1B1F]">
            Chatbot
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
