import React from "react";
import { View } from "react-native";
import TextInput from "../ui/Forms/TextInput";
import LargeButton from "../ui/Forms/LargeButtom";
import { useUser } from "@clerk/clerk-expo";
import { SignupForm } from "@/interfaces/SigupForm";

interface StepsSignupProps {
  onNext?: () => void;
  form: SignupForm;
  setForm: React.Dispatch<React.SetStateAction<SignupForm>>;
}

export default function StepForm1({ onNext, form, setForm }: StepsSignupProps) {
  const { user, isLoaded } = useUser();
  const [stepValid, setStepValid] = React.useState(false);

  // Prefill assim que o Clerk carregar e tivermos um usuário
  React.useEffect(() => {
    if (!isLoaded || !user) return;

    setForm((prev) => {
      const nameFromClerk =
        user.fullName?.trim() ||
        [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

      const emailFromClerk =
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        "";

      // Só preenche se os campos estiverem vazios
      const shouldSetName = !prev.name && !!nameFromClerk;
      const shouldSetEmail = !prev.email && !!emailFromClerk;

      if (!shouldSetName && !shouldSetEmail) return prev;

      return {
        ...prev,
        name: shouldSetName ? nameFromClerk : prev.name,
        email: shouldSetEmail ? emailFromClerk : prev.email,
      };
    });
  }, [isLoaded, user, setForm]);

  React.useEffect(() => {
    const emailOk = /\S+@\S+\.\S+/.test(form.email);
    setStepValid(form.name.trim() !== "" && emailOk);
  }, [form.name, form.email]);

  const handleNext = () => onNext?.();

  return (
    <View className="flex-1 mt-28">
      <TextInput
        placeholder="Digite seu Nome"
        label="Nome"
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
      />

      <TextInput
        placeholder="youremail@example.com"
        label="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
      />
      <View className="mt-8">
        <LargeButton
          onPress={handleNext}
          title="Próximo"
          disabled={!stepValid}
        />
      </View>
    </View>
  );
}
