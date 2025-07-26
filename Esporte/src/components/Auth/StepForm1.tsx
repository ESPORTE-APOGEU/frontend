import React from 'react';
import { View, Text, Pressable } from "react-native";
import useSignup from '@/hooks/singup';
import LargeButton from "../ui/Forms/LargeButtom";
import TextInput from '../ui/Forms/TextInput';
interface StepsSignupProps {
  onNext?: () => void;
}
export default function StepForm1({ onNext }: StepsSignupProps) {
  const [stepValid, setStepState] = React.useState(false);
  const handleNext = () => {
      if (onNext) {
        onNext();
      }
    };
    const { form, setForm } = useSignup();
  React.useEffect(() => {
    // Validação simples: verifica se o nome e email estão preenchidos
    const isValid = form.name.trim() !== '' && form.email.trim() !== '';
    setStepState(isValid);
  }, [form.name, form.email]);

  return (
    <View className="flex-1 justify-center items-center mt-8">
      <TextInput 
        placeholder="Digite seu Nome"  
        label='Nome' value={form.name} onChangeText={(text) => setForm({ ...form, name: text })} />
      <TextInput 
        placeholder="Digite seu Email" 
        label='Email' value={form.email} onChangeText={(text) => setForm({ ...form, email: text })} />
      <LargeButton 
        onPress={handleNext}  
        title="Próximo"
        disabled={!stepValid} />
    </View>
  );
}
