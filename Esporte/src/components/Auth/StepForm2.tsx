// src/components/Auth/StepForm2.tsx
import React from "react";
import { View, Alert } from "react-native";
import LargeButton from "../ui/Forms/LargeButtom";
import TextInput from "../ui/Forms/TextInput";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { SignupForm } from "@/interfaces/SigupForm";

interface StepsSignupProps {
  onNext?: () => void;
  form: SignupForm;
  setForm: React.Dispatch<React.SetStateAction<SignupForm>>;
}

export default function StepForm2({ onNext, form, setForm }: StepsSignupProps) {
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();

  // Descobre se a conta já tem senha no Clerk
  const hasPassword =
    ((user as any)?.passwordEnabled ?? (user as any)?.hasPassword) ?? false;

  // Se já está logado (SSO) E já tem senha → pula este passo
  React.useEffect(() => {
    if (isLoaded && isSignedIn && hasPassword) {
      onNext?.();
    }
  }, [isLoaded, isSignedIn, hasPassword]);

  const validateLocal = () => {
    if (!form.password?.trim() || !form.confirmPassword?.trim()) {
      Alert.alert("Campos obrigatórios", "Preencha a senha e a confirmação.");
      return false;
    }
    if (form.password.length < 8) {
      Alert.alert("Senha fraca", "A senha precisa ter pelo menos 8 caracteres.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert("Confirmação", "A confirmação não confere com a senha.");
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    try {
      // Usuário já logado via SSO e ainda SEM senha → define agora
      if (isLoaded && isSignedIn && user && !hasPassword) {
        if (!validateLocal()) return;

        await user.updatePassword({
          newPassword: form.password,
          // não envie currentPassword aqui, pois a conta não tinha senha
          signOutOfOtherSessions: false,
        });
        await user.reload?.(); // reflete que agora tem senha
        onNext?.();
        return;
      }

      // Fluxo clássico (e-mail/senha): só segue; Step 3 fará o signUp.create
      if (!validateLocal()) return;
      onNext?.();
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.message ||
        err?.message ||
        "Não foi possível definir a senha agora.";
      Alert.alert("Erro", msg);
    }
  };

  // Se vamos pular automaticamente, não renderiza nada
  if (isLoaded && isSignedIn && hasPassword) {
    return <View />;
  }

  return (
    <View>
      <TextInput
        password
        label="Senha"
        placeholder="Digite sua senha"
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
      />
      <TextInput
        password
        label="Confirmar Senha"
        placeholder="Confirme sua senha"
        value={form.confirmPassword}
        onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
      />
      <LargeButton onPress={handleNext} title="Next" />
    </View>
  );
}
