import React from "react";
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TextInput from "../../../src/components/ui/TextInput";

const GOOGLE_ICON = require("../../assets/images/google-logo.png");
const APP_LOGO = require("../../assets/images/app-logo.png");

export default function LoginScreen() {
  const handleCreateAccountPress = () => {
    console.log("Create Account Pressed");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#F2F2F2]"
    >
      {/* Círculo gigante */}
      <View
        className="
          absolute
          bg-[#07D362]
          rounded-full
          w-[138vw] h-[138vw]
          -top-[33vh]
          -left-[19vw]
          -translate-x-1/2
        "
      />

      {/* Círculo menor com logo */}
      <View
        className="
          absolute
          bg-[#F2F2F2]
          rounded-full
          items-center justify-center
          w-[25vw] h-[25vw]
          top-[21vh]
          left-[38vw]
          -translate-x-1/2
        "
      >
        <Image
          source={APP_LOGO}
          className="w-[15.75vw] h-[15.75vw] rounded-[12px]"
          resizeMode="contain"
        />
      </View>

      <View className="flex-1 justify-center items-center px-[6%]">
        {/* Título */}
        <Text className="text-[#00432C] font-bold mt-[22vh] text-[48px]">
          Join
        </Text>
        {/* Subtítulo */}
        <Text className="text-[#999999] text-center mb-[6vh] text-[13px]">
          Find sports and wellness events near you
        </Text>

        {/* Inputs */}
        <TextInput placeholder="youremail@example.com" label="Email" />
        <TextInput placeholder="******" label="Password" />

        {/* Botão Log In */}
        <TouchableOpacity
          className="
            bg-[#40B843]
            w-[80%]
            items-center justify-center
            shadow-md
            mt-2
            h-[6vh]
            rounded-[20px]
          "
          onPress={() => {}}
        >
          <Text className="text-white font-semibold text-[24px]">Log In</Text>
        </TouchableOpacity>

        {/* Create Account */}
        <Text
          className="text-[rgba(0,0,0,0.63)] font-bold mt-5 text-[13px]"
          onPress={handleCreateAccountPress}
        >
          Create Account Now!
        </Text>

        {/* Linha + OR + Linha */}
        <View className="flex-row items-center justify-center w-full mt-3">
          <View className="border-t border-[#999999] w-[32%]" />
          <Text className="mx-3 text-[#999999] text-[12px]">OR</Text>
          <View className="border-t border-[#999999] w-[32%]" />
        </View>

        {/* Botões sociais */}
        <View className="flex-row justify-center mt-4 w-full space-x-6">
          {/* Apple */}
          <TouchableOpacity
            className="
              bg-black
              shadow-lg
              items-center justify-center
              w-[14vw] h-[14vw]
              rounded-full
            "
            onPress={() => {}}
          >
            <Ionicons name="logo-apple" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Google */}
          <TouchableOpacity
            className="
              bg-white
              shadow-lg
              items-center justify-center
              w-[14vw] h-[14vw]
              rounded-full
            "
            onPress={() => {}}
          >
            <Image
              source={GOOGLE_ICON}
              className="w-[5vw] h-[5vw]"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
