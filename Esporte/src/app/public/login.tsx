import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // expo-vector-icons
import TextInput from "@/src/components/ui/TextInput";

const GOOGLE_ICON = require("../../assets/images/google-logo.png"); // coloque seu png aqui
const APP_LOGO = require("../../assets/images/app-logo.png"); // coloque sua logo aqui

export default function LoginScreen() {
  const { width, height } = useWindowDimensions();

  const vw = width / 100;
  const vh = height / 100;
  const baseW = 440; // largura do layout do Figma
  const scale = width / baseW;

  const sizes = useMemo(
    () => ({
      inputH: 4.7 * vh,
      buttonH: 6 * vh,
      buttonR: 20 * scale,
      inputR: 8 * scale,
      circleBig: 138 * vw, // elipse gigante de fundo
      circleSmall: 25 * vw,
      iconBtn: 14 * vw,
    }),
    [vw, vh, scale]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#F2F2F2]"
    >
      <View
        className="absolute bg-[#07D362] rounded-full"
        style={{
          width: sizes.circleBig,
          height: sizes.circleBig,
          top: -37 * vh,
          left: width / 2 - sizes.circleBig / 2,
        }}
      />

      {/* Círculo com logo */}
      <View
        className="absolute bg-[#F2F2F2] rounded-full items-center justify-center"
        style={{
          width: sizes.circleSmall,
          height: sizes.circleSmall,
          top: 17 * vh,
          left: width / 2 - sizes.circleSmall / 2,
        }}
      >
        <Image
          source={APP_LOGO} // troque pela sua logo
          style={{
            width: sizes.circleSmall * 0.63,
            height: sizes.circleSmall * 0.63,
            borderRadius: 12 * scale,
          }}
        />
      </View>

      <View className="flex-1 justify-center items-center px-[6%]">
        {/* "Join" */}
        <Text
          className="text-[#00432C] font-bold"
          style={{
            fontSize: 10.9 * vw,
            lineHeight: 10.9 * vw * 1.5,
            marginTop: 12 * vh,
          }}
        >
          Join
        </Text>

        {/* Subtítulo */}
        <Text
          className="text-[#999999] text-center"
          style={{ fontSize: 3.2 * vw, marginTop: 2 * vh, width: "80%" }}
        >
          Find sports and wellness events near you
        </Text>

        {/* INPUT Email */}
        <TextInput placeholder="youremail@example.com" label="email" />

        {/* INPUT Password */}
        <TextInput placeholder="******" label="password" />

        {/* Botão Log In */}
        <TouchableOpacity
          className="bg-[#40B843] w-full items-center justify-center shadow-md mt-6"
          style={{ height: sizes.buttonH, borderRadius: sizes.buttonR }}
          onPress={() => {}}
        >
          <Text
            className="text-white font-semibold"
            style={{ fontSize: 5.5 * vw, lineHeight: 5.5 * vw * 1.5 }}
          >
            Log In
          </Text>
        </TouchableOpacity>

        {/* Create account */}
        <Text
          className="text-[rgba(0,0,0,0.63)] font-bold mt-5"
          style={{ fontSize: 3.3 * vw }}
        >
          Create Account Now!
        </Text>

        {/* Linha + OR + Linha */}
        <View className="flex-row items-center w-full mt-3">
          <View className="flex-1 h-[1px] bg-[rgba(0,0,0,0.57)]" />
          <Text className="mx-3 text-[#999999]" style={{ fontSize: 3 * vw }}>
            OR
          </Text>
          <View className="flex-1 h-[1px] bg-[rgba(0,0,0,0.57)]" />
        </View>

        {/* Social buttons */}
        <View className="flex-row justify-center mt-4 w-full gap-x-6">
          {/* Apple */}
          <TouchableOpacity
            className="bg-black shadow-lg items-center justify-center"
            style={{
              width: sizes.iconBtn,
              height: sizes.iconBtn,
              borderRadius: sizes.iconBtn / 2,
            }}
            onPress={() => {}}
          >
            <Ionicons
              name="logo-apple"
              size={sizes.iconBtn * 0.45}
              color="#fff"
            />
          </TouchableOpacity>

          {/* Google */}
          <TouchableOpacity
            className="bg-white shadow-lg items-center justify-center"
            style={{
              width: sizes.iconBtn,
              height: sizes.iconBtn,
              borderRadius: sizes.iconBtn / 2,
            }}
            onPress={() => {}}
          >
            {/* Você pode trocar por um SVG/colorido. Aqui só um ícone Ionicons genérico. */}
            <Image
              source={GOOGLE_ICON}
              style={{
                width: sizes.iconBtn * 0.55,
                height: sizes.iconBtn * 0.55,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
