import React from 'react';
import { View, Text, Pressable, Image , BackHandler} from "react-native";
import { useFocusEffect } from 'expo-router';

import StepsSignup from "@/src/components/Auth/StepsController";

export default function CriarContaScreen() {
  const[step, setStep] = React.useState(1);
  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };
  const handleBack = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };
    useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
          if (step > 1) {
            setStep(prev => prev - 1);
            return true;
          }
          return false; // Permite o back do sistema quando step é 1
        };

        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => subscription.remove();
      }, [step])
    );
  return (
    <View className='flex-1'>
      {/*<HeaderCreateAccount />*/}
      <View className="pb-10 h-27 bg-[#07D362] rounded-bl-[20%] shadow-black shadow-2xl">
        <Pressable className="p-8 ml-4 mt-8" onPress={handleBack}>
          <Image source={require('../../assets/images/seta-voltar.png')}
          />
        </Pressable>
        <Text className="text-5xl text-white m-8 font-[Poppins-Bold] font-bold">Criar {'\n'}Conta.</Text>
      </View>
      <StepsSignup step={step} onNext={handleNext} />
    </View>
  );
}