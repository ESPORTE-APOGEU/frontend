import React, { useCallback, useMemo } from "react";
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
import { useSignIn, useSSO, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";

const GOOGLE_ICON = require("../../assets/images/google-logo.png");
const APP_LOGO = require("../../assets/images/app-logov3.png");

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();
  const { getToken } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  // Decide a rota após autenticar no Clerk
  const routeAfterAuth = useCallback(async () => {
    try {
      const fresh =
        (await getToken({ template: "backend", skipCache: true })) ||
        (await getToken({ template: "backend" }));
      if (!fresh) {
        router.replace("/auth/sign-in");
        return;
      }
      const res = await fetch(`${BACKEND_URL}/api/v1/users/me`, {
        headers: { Authorization: `Bearer ${fresh}` },
      });

      if (res.ok) {
        router.replace("/auth/home");
      } else if (res.status === 404) {
        router.replace("/auth/criarConta");
      } else if (res.status === 401) {
        router.replace("/auth/sign-in");
      } else {
        router.replace("/auth/sign-in");
      }
    } catch {
      router.replace("/auth/sign-in");
    }
  }, [getToken, router]);

  // E-mail / senha
  const onSignInPress = async () => {
    if (!isLoaded) return;
    try {
      const attempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        await routeAfterAuth();
      } else {
        console.error("Login incompleto:", JSON.stringify(attempt, null, 2));
      }
    } catch (err) {
      console.error("Erro ao logar:", err);
    }
  };

  // Social (Google/Apple)
  const handleSocialSignIn = useCallback(
    async (strategy: "oauth_google" | "oauth_apple") => {
      try {
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
          await routeAfterAuth();
        }
      } catch (err) {
        console.error("Erro no SSO:", err);
      } finally {
        WebBrowser.coolDownAsync();
      }
    },
    [startSSOFlow, routeAfterAuth]
  );

  const handleCreateAccountPress = () => {
    router.replace("/auth/criarConta");
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
          bg-[#43A047]
          rounded-full
          w-[138vw] h-[138vw]
          -top-[35vh]
          -left-[19vw]
          -translate-x-1/2
        "
      />

      {/* Círculo menor com logo */}
      <View
        className="
          absolute
          bg-transparent
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
          className="w-[70.75vw] h-[60.75vw] rounded-[12px] bg-transparent mb-10"
          resizeMode="contain"
        />
      </View>

      <View className="flex-1 justify-center items-center px-[6%]">
        {/* Título */}
        <Text className="text-[#00432C] font-bold mt-[22vh] text-[48px]">
          
        </Text>
        {/* Subtítulo */}
        <Text className="text-[#999999] text-center mb-[6vh] text-[13px]">
          Your wellness social network No Posts. Only meetings. Real meetings
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
        <View className="flex-row justify-center mt-4 w-full">
          {/* Apple */}
          <TouchableOpacity
            className="
              bg-black
              shadow-lg
              items-center justify-center
              w-[14vw] h-[14vw]
              rounded-full
              mr-6
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
