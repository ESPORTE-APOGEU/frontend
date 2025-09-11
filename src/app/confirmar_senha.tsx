import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function ConfirmarSenha() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  return (
    <View className="flex-1 bg-[#FFFFFF]">
      {/* Seta para a esquerda com zIndex maior */}
      <TouchableOpacity
        className="absolute top-[56px] left-[44px] z-50"
        onPress={() => { router.push("/create_conta"); }}
      >
        <Text className="text-[40px] text-white">←</Text>
      </TouchableOpacity>

      <TouchableOpacity className="absolute top-[135px] left-[74px] z-50">
        <Text className="text-[40px] text-white">Create                  Account</Text>
      </TouchableOpacity>

      {/* Rectangle 82 (parte superior da tela) */}
      <View className="w-[440px] h-[276px] bg-[#07D362] rounded-bl-[80px] shadow-md" />

      <TouchableOpacity className="absolute top-[400px] left-[52px] z-50">
        <Text className="text-[15px]">Password</Text>
      </TouchableOpacity>

      {/* Campo de nova senha com toggle de visibilidade */}
      <View className="absolute top-[423px] left-[46px] w-[328px] h-[42px] bg-[#F7F7F7BF] rounded-[8px] border-b-[1px] border-b-[#358838] shadow-md flex-row items-center px-4">
        <TextInput
          placeholder="Enter your password"
          secureTextEntry={!passwordVisible}
          className="flex-1"
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Text className="text-black text-lg">
            {passwordVisible ? "👁️" : "👁️"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="absolute top-[489px] left-[52px] z-50">
        <Text className="text-[15px]">Confirm your password</Text>
      </TouchableOpacity>

      {/* Campo de confirmação de senha com toggle de visibilidade */}
      <View className="absolute top-[517px] left-[46px] w-[328px] h-[42px] bg-[#F7F7F7BF] rounded-[8px] border-b-[1px] border-b-[#358838] shadow-md flex-row items-center px-4">
        <TextInput
          placeholder="Enter your password"
          secureTextEntry={!confirmPasswordVisible}
          className="flex-1"
        />
        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
          <Text className="text-black text-lg">
            {confirmPasswordVisible ? "👁️" : "👁️"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botão para próxima página */}
      <TouchableOpacity
        className="absolute top-[595px] left-[46px] w-[328px] h-[56px] bg-[#40B843] rounded-[20px] shadow-md flex items-center justify-center"
        onPress={() => { router.push("/create_conta"); }}
      >
        <Text className="text-white text-lg font-bold text-[25px]">Next</Text>
      </TouchableOpacity>
    </View>
  );
}