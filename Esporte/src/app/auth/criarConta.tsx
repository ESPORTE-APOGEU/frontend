import React from 'react';
import { View, Text, Pressable, Image } from "react-native";
import StepsSignup from "@/src/components/Auth/StepsController";

export default function CriarContaScreen() {
  const[step, setStep] = React.useState(1);
  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };
  const handleBack = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };
  return (
    <View>
      {/*<HeaderCreateAccount />*/}
      <View className="pb-10 h-27 bg-[#07D362] rounded-bl-[20%] shadow-black shadow-2xl">
        <Pressable className="p-4 ml-4 mt-8" onPress={handleBack}>
          <Image source={require('@/src/assets/images/seta-voltar.png')}
          />
        </Pressable>
        <Text className="text-5xl text-white m-8 font-[Poppins-Bold]">Criar {'\n'}Conta.</Text>
      </View>
      <StepsSignup step={step} onNext={handleNext} />
    </View>
  );
}