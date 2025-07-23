import React from 'react';
import { View, Text, Pressable } from "react-native";
import LargeButton from "../ui/Forms/LargeButtom";
import DropDownInput from '../ui/Forms/DropDownInput';
interface StepsSignupProps {
  onNext?: () => void;
}
export default function StepForm2({ onNext }: StepsSignupProps) {
    const handleNext = () => {
      if (onNext) {
        onNext();
      }
    };
  return (
    <View>
      <Text>Step 2</Text>
      <View className="p-4">
      <DropDownInput
        label="Esporte"
        selectedValue=""
        onValueChange={() => {}}
        options={[
          { label: "Futebol", value: "futebol" },
          { label: "Basquete", value: "basquete" },
        ]}
        placeholder="Selecione o seu esporte"
      /></View>
      <LargeButton onPress={handleNext}  title="Next" />
    </View>
  );
}
