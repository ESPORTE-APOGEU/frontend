import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Svg, { G, Path, Defs, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite, FeBlend } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

export default function BottomNavigation() {
  const { width } = Dimensions.get('window');
  
  const handleHomePress = () => {
    console.log("Home pressed");
  };

  const handleSearchPress = () => {
    console.log("Search pressed");
  };

  const handleAddPress = () => {
    console.log("Add pressed");
  };

  const handleExercisesPress = () => {
    console.log("Exercícios pressed");
    router.push("/auth/settings");
  };

  const handleChatbotPress = () => {
    console.log("Chatbot pressed");
  };

  return (
    <View className="absolute w-full" style={{ bottom: 20, height: 91 }}>
      {/* SVG como plano de fundo */}
      <Svg
        width={width}
        height={91}
        viewBox="0 0 400 91"
        style={{ position: 'absolute', left: 0, bottom: 0 }}
      >
        <G filter="url(#filter0_d_263_89)">
          <Path d="M12 38.0575C12 21.489 25.4595 8.0588 42.028 8.04822C78.0239 8.02524 94.8455 7.97108 125.777 8.01951C137.337 8.03761 147.665 14.5113 154.086 24.1239C164.076 39.0797 177.216 51.8077 199.5 51.8077C221.4 51.8077 233.923 40.495 243.372 26.2689C249.94 16.3786 260.446 9.56603 272.318 9.47363C303.172 9.23351 321.685 8.46311 357.974 8.17115C374.542 8.03785 388 21.489 388 38.0575V45C388 61.5686 374.569 75 358 75H42C25.4315 75 12 61.5685 12 45V38.0575Z" fill="white" />
        </G>
        <Defs>
          <Filter id="filter0_d_263_89" x="0" y="0" width="400" height="91" filterUnits="userSpaceOnUse">
            <FeFlood floodOpacity="0" result="BackgroundImageFix" />
            <FeColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <FeOffset dy="4" />
            <FeGaussianBlur stdDeviation="6" />
            <FeComposite in2="hardAlpha" operator="out" />
            <FeColorMatrix type="matrix" values="0 0 0 0 0.0509804 0 0 0 0 0.0392157 0 0 0 0 0.172549 0 0 0 0.06 0" />
            <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_263_89" />
            <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_263_89" result="shape" />
          </Filter>
        </Defs>
      </Svg>

      {/* Conteúdo da navegação */}
      <View className="absolute bottom-0 w-full flex-row items-end justify-between px-12 pb-6">
        {/* Item: Home */}
        <TouchableOpacity
          className="items-center justify-center"
          onPress={handleHomePress}
          style={{ width: 50 }}
        >
          <Ionicons name="home-outline" size={24} color="#9CA3AF" />
          <Text className="text-gray-400 font-medium mt-1" style={{ fontSize: 10 }}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Item: Search */}
        <TouchableOpacity
          className="items-center justify-center"
          onPress={handleSearchPress}
          style={{ width: 50 }}
        >
          <Ionicons name="search-outline" size={24} color="#9CA3AF" />
          <Text className="text-gray-400 font-medium mt-1" style={{ fontSize: 10 }}>
            Search
          </Text>
        </TouchableOpacity>

        {/* Botão Central (+) - Elevado */}
        <TouchableOpacity
          className="items-center justify-center rounded-full"
          onPress={handleAddPress}
          style={{
            backgroundColor: '#40B843',
            width: 56,
            height: 56,
            marginBottom: 20,
            shadowColor: '#40B843',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>

        {/* Item: Exercícios */}
        <TouchableOpacity
          className="items-center justify-center"
          onPress={handleExercisesPress}
          style={{ width: 50 }}
        >
          <Ionicons name="fitness-outline" size={24} color="#9CA3AF" />
          <Text className="text-gray-400 font-medium mt-1" style={{ fontSize: 10 }}>
            Fitness
          </Text>
        </TouchableOpacity>

        {/* Item: Chatbot */}
        <TouchableOpacity
          className="items-center justify-center"
          onPress={handleChatbotPress}
          style={{ width: 50 }}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#1F2937" />
          <Text className="text-gray-700 font-medium mt-1" style={{ fontSize: 10 }}>
            Chat
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
