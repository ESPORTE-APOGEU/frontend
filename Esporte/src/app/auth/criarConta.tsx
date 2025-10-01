import React from "react";
import {
  View,
  Text,
  Pressable,
  BackHandler,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useFocusEffect, useRouter, useNavigation } from "expo-router";

import StepsSignup from "@/src/components/Auth/StepsController";
import useSignup from "@/hooks/Singup";
import SetaVoltar from "@/src/components/icons/seta-voltar";

export default function CriarContaScreen() {
  const [step, setStep] = React.useState(1);
  const { form, setForm } = useSignup();

  const router = useRouter();
  const navigation = useNavigation();

  const handleNext = () => setStep((prev) => prev + 1);

  const handleBack = React.useCallback(() => {
    if (step > 1) {
      setStep((s) => s - 1);
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.replace("/auth/sign-in");
    }
  }, [step, navigation, router]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // mesmo comportamento do botão de voltar da UI
        handleBack();
        return true; // consumimos o back do Android
      };

      const sub = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => sub.remove();
    }, [handleBack])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
      >
        <View className="flex-1">
          <View className="h-[220px] pb-6 bg-[#43A047] rounded-bl-[60px] shadow-black shadow-2xl">
            <Pressable
              className="p-4 ml-2 mt-2"
              onPress={handleBack}
              hitSlop={12}
            >
              <SetaVoltar />
            </Pressable>

            <Text className="text-4xl text-white font-poppins mt-3 ml-12 leading-tight">
              Criar
            </Text>
            <Text className="text-4xl text-white font-poppins mt-3 ml-12 leading-tight">
              Conta.
            </Text>
          </View>

          <StepsSignup
            step={step}
            onNext={handleNext}
            form={form}
            setForm={setForm}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
