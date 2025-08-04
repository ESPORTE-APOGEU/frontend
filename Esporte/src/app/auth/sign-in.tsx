import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TextInput from "../../components/ui/TextInput";
import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import { useUser } from "@clerk/clerk-expo";

const GOOGLE_ICON = require("../../assets/images/google-logo.png");
const APP_LOGO = require("../../assets/images/app-logo.png");

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const { startSSOFlow } = useSSO();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleCreateAccountPress = () => {
    router.replace("/auth/criarConta");
  };

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });

        // 1. Pega o userId do Clerk
        const { user } = useUser();
        const idClerk = user?.id;

        if (!idClerk) {
          console.error("User ID do Clerk não encontrado");
          return;
        }

        // 2. Envia para o backend
        const response = await fetch(
          "http://localhost:8080/api/v1/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idClerk }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erro ao autenticar com o backend");
        }

        // 3. Armazena o token do backend
        await SecureStore.setItemAsync("token", data.token);

        // 4. Redireciona
        router.replace("/confirmar_senha");
      } else {
        console.error(
          "Erro no login do Clerk:",
          JSON.stringify(signInAttempt, null, 2)
        );
      }
    } catch (err) {
      console.error("Erro ao logar:", err);
    }
  };

  const handleSocialSignIn = useCallback(
    async (strategy: "oauth_google" | "oauth_apple") => {
      try {
        // Opcional: melhora UX no Android
        await WebBrowser.warmUpAsync();

        const { createdSessionId, setActive: activate } = await startSSOFlow({
          strategy,
        });

        if (createdSessionId) {
          if (!activate) {
            console.error("Clerk ainda não inicializou o setActive");
            return;
          }
          await activate({ session: createdSessionId });
          router.replace("/create_conta");
        }
      } catch (err) {
        console.error("Erro no SSO:", err);
      } finally {
        WebBrowser.coolDownAsync();
      }
    },
    [startSSOFlow, router]
  );

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
        <TextInput
          placeholder="youremail@example.com"
          label="Email"
          onChangeText={setEmailAddress}
          value={emailAddress}
        />
        <TextInput
          placeholder="******"
          label="Password"
          onChangeText={setPassword}
          value={password}
        />

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
          onPress={onSignInPress}
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
            onPress={() => handleSocialSignIn("oauth_apple")}
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
            onPress={() => handleSocialSignIn("oauth_google")}
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
