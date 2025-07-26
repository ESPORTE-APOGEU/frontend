import React from 'react';
import { View, Text, Pressable } from "react-native";
import LargeButton from "../ui/Forms/LargeButtom";
import TextInput from '../ui/Forms/TextInput';
import DropDownInput from '../ui/Forms/DropDownInput';
import useSignup from '@/hooks/singup';

interface StepsSignupProps {
  onNext?: () => void;
}
export default function StepForm2({ onNext }: StepsSignupProps) {
    const { form, setForm } = useSignup();
    const handleNext = () => {
      if (onNext) {
        onNext();
      }
    };
  return (
    <View>
       <TextInput
          password={true}
          label="Senha"
          placeholder="Digite sua senha"
          
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
        />
        <TextInput
          password={true}
          label="Confirmar Senha"
          placeholder="Confirme sua senha"
          value={form.confirmPassword}
          onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
        />
      <LargeButton onPress={handleNext}  title="Next" />
    </View>
  );
}
