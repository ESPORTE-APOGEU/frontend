import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function CreateConta() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View className="flex-1 bg-[#FFFFFF]">
      {/* Seta para a esquerda com zIndex maior */}
      <TouchableOpacity className="absolute top-[56px] left-[44px] z-50">
        <Text className="text-[40px] text-white">←</Text>
      </TouchableOpacity>

      <TouchableOpacity className="absolute top-[135px] left-[74px] z-50">
        <Text className="text-[40px] text-white">Create                  Account</Text>
      </TouchableOpacity>

      {/* Rectangle 82 (parte superior da tela) */}
      <View className="w-[440px] h-[276px] bg-[#07D362] rounded-bl-[80px] shadow-md" />

      <TouchableOpacity className="absolute top-[400px] left-[52px] z-50">
        <Text className="text-[15px]">Email</Text>
      </TouchableOpacity>

      {/* Campo de email */}
      <View className="absolute top-[423px] left-[46px]">
        <TextInput
          placeholder="Enter your first name here"
          className="w-[328px] h-[42px] bg-[#F7F7F7BF] rounded-[8px] border-b-[1px] border-b-[#358838] shadow-md px-4"
        />
      </View>

      <TouchableOpacity className="absolute top-[489px] left-[52px] z-50">
        <Text className="text-[15px]">Senha</Text>
      </TouchableOpacity>

      {/* Campo de senha com toggle de visibilidade */}
      <View className="absolute top-[517px] left-[46px] w-[328px] h-[42px] bg-[#F7F7F7BF] rounded-[8px] border-b-[1px] border-b-[#358838] shadow-md flex-row items-center px-4">
        <TextInput
          placeholder="Enter your email"
          secureTextEntry={!passwordVisible}
          className="flex-1"
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Text className="text-black text-lg">
            {passwordVisible ? "👁️" : "👁️"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botão para próxima página */}
      <TouchableOpacity
        className="absolute top-[595px] left-[46px] w-[328px] h-[56px] bg-[#40B843] rounded-[20px] shadow-md flex items-center justify-center"
        onPress={() => { router.push("/confirmar_senha"); }}
      >
        <Text className="text-white text-lg font-bold text-[25px]">Next</Text>
      </TouchableOpacity>
    </View>
  );
}