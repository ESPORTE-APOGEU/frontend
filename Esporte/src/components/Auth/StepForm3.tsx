import React from 'react';
import { View, Text, Pressable, Alert } from "react-native";
import LargeButton from "../ui/Forms/LargeButtom";
import TextInput from '../ui/Forms/TextInput';
import DropDownInput from '../ui/Forms/DropDownInput';
interface StepsSignupProps {
  onNext?: () => void;
}
export default function StepForm3({ onNext }: StepsSignupProps) {
    const handleNext = () => {
      if (onNext) {
        onNext();
      }
    };
  return (
    <View>
        <TextInput label="Idade" placeholder="digite a sua idade" />
      <DropDownInput
        label="Gênero"
        selectedValue=""
        onValueChange={() => {}}
        options={[
          { label: "Masculino", value: "masculino" },
          { label: "Feminino", value: "feminino" },
        ]}
        placeholder="Selecione o seu gênero"
      />
      <LargeButton onPress={() => { Alert.alert("Conta criada com sucesso!"); }}  title="Criar Conta" />
    </View>
  );
}
