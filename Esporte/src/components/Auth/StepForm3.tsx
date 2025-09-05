import React from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Gender, SignupForm } from "@/interfaces/SigupForm";
import LargeButton from "../ui/Forms/LargeButtom";
import DateInput from "../ui/Forms/DateInput";
import DropDownInput from "../ui/Forms/DropDownInput";
import Autocomplete from "../ui/Forms/AutoCompleteTags";
import TextInput from "../ui/Forms/TextInput"; // seu input estilizado
import { useAuth, useSignUp, useUser } from "@clerk/clerk-expo";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";


interface StepsSignupProps {
  onNext?: () => void;
  form: SignupForm;
  setForm: React.Dispatch<React.SetStateAction<SignupForm>>;
}
type Option = { label: string; value: string };

export default function StepForm3({ form, setForm }: StepsSignupProps) {
    const router = useRouter();        

  // estados do formulário
  const [selectedCity, setSelectedCity] = React.useState(form.city ?? "");
  const [selectedSports, setSelectedSports] = React.useState<string[]>(form.sports ?? []);

  // Clerk
  const { isSignedIn, getToken } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { signUp, setActive, isLoaded: signUpLoaded } = useSignUp();

  // verificação por código
  const [codeModalVisible, setCodeModalVisible] = React.useState(false);
  const [emailCode, setEmailCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setForm((prev) => ({ ...prev, sports: selectedSports }));
  }, [selectedSports]);

  React.useEffect(() => {
    setForm((prev) => ({ ...prev, city: selectedCity }));
  }, [selectedCity]);

  const registerInBackend = async (jwtToken: string, clerkUserId: string) => {
    const normalizedGender =
      typeof form.gender === 'string'
        ? (form.gender.charAt(0).toUpperCase() + form.gender.slice(1).toLowerCase()) 
        : form.gender;
    console.log("register:" + jwtToken);
    const resp = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        id: clerkUserId,
        name: form.name,
        email: form.email,
        birthday: form.birthday,
        gender: normalizedGender,
        city: form.city,
        sports: form.sports,
      }),
    });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new Error(`Falha ao registrar no backend (${resp.status}): ${txt}`);
    }
  };

  const handleCreateAccount = async () => {
    try {
      setLoading(true);

      // SSO (Google/Apple) já está logado -> sem código

      // FLUXO SSO (já logado)
      if (isSignedIn && userLoaded && user) {
        const token = await getToken({ template: "backend" });
        if (!token) throw new Error("Não foi possível obter o token JWT.");

        await Clipboard.setStringAsync(token);
        await registerInBackend(token, user.id);

        // Opção A: navegar direto
        router.replace("/auth/home");


        return;
      }

      // E-mail/senha: cria no Clerk e envia o código
      if (!signUpLoaded) throw new Error("Clerk SignUp ainda não carregou.");
      if (!signUp || !setActive) throw new Error("Clerk SignUp não inicializado.");

      await signUp.create({ emailAddress: form.email, password: form.password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // abre modal para digitar o código
      setCodeModalVisible(true);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Erro", err?.message ?? "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCode = async () => {
    try {
      setLoading(true);
      if (!signUp || !setActive) throw new Error("Clerk SignUp não inicializado.");
      const code = emailCode.trim();
      if (!code) throw new Error("Informe o código que enviamos ao seu e-mail.");

      const verification = await signUp.attemptEmailAddressVerification({ code });

      if (verification.status !== "complete") {
        throw new Error("Código inválido ou expirado.");
      }

      await setActive({ session: verification.createdSessionId });

      const token = await getToken({ template: "backend" });
      if (!token) throw new Error("Não foi possível obter o token JWT.");

      const clerkUserId = user?.id || verification?.createdUserId || "";
      if (!clerkUserId) throw new Error("Não foi possível obter o ID do usuário.");

      await Clipboard.setStringAsync(token);
      await registerInBackend(token, clerkUserId);

      setCodeModalVisible(false);
      setEmailCode("");
      Alert.alert("Sucesso", "Conta criada e vinculada com sucesso!", [
        { text: "Ir para eventos", onPress: () => router.replace("/auth/home") },
      ]);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Erro", err?.message ?? "Erro ao confirmar código");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      if (!signUp) return;
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert("Reenviado", "Enviamos um novo código para o seu e-mail.");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Erro", err?.message ?? "Não foi possível reenviar o código");
    }
  };

  const getCidadesFormatadas = async (): Promise<Option[]> => {
    const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios");
    if (!res.ok) throw new Error("Erro ao buscar cidades");
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Dados inválidos recebidos da API");
    return data
      .map((cidade: any) => {
        const nome = cidade?.nome;
        const uf = cidade?.microrregiao?.mesorregiao?.UF?.sigla;
        if (!nome || !uf) return null;
        const label = `${nome} - ${uf}`;
        return { label, value: label };
      })
      .filter(Boolean) as Option[];
  };

  return (
    <View>
      {/*<TextInput
          label="Idade"
          placeholder="digite a sua idade"
          keyboardType="numeric"
          value={form.age ? String(form.age) : ''}
          onChangeText={(text) => setForm({ ...form, age: Number(text) })}
        />*/}
      <DateInput
        label="Data de Nascimento"
        value={form.birthday}
        onChange={(date) => setForm({ ...form, birthday: date })}
        placeholder="Selecione sua data de nascimento"
        maximumDate={new Date(2020, 11, 31)}
      />
      <DropDownInput
        label="Gênero"
        selectedValue={form.gender ?? ""}
        onValueChange={(value) => setForm({ ...form, gender: value as Gender })}
        options={[
          { label: "Masculino", value: Gender.Male },
          { label: "Feminino", value: Gender.Female },
          { label: "Outro", value: Gender.Other },
        ]}
        placeholder="Selecione o seu gênero"
      />

      <Autocomplete
        label="Cidade"
        awaitOptions={getCidadesFormatadas}
        placeholder="Digite para buscar sua cidade"
        multiSelect={false}
        selectedValue={selectedCity}
        onSelect={(value) => {
          setSelectedCity(value);
          setForm({ ...form, city: value });
        }}
        onRemove={() => {
          setSelectedCity("");
          setForm({ ...form, city: "" });
        }}
      />
      <DropDownInput
        label="Esportes"
        selectedValue={""}
        multiSelect={true}
        selectedItems={selectedSports}
        onValueChange={(value) => {
          if (value && !selectedSports.includes(value)) {
            setSelectedSports([...selectedSports, value]);
          }
        }}
        options={[
          { label: "Futebol", value: "Futebol" },
          { label: "Basquete", value: "Basquete" },
          { label: "Vôlei", value: "Vôlei" },
          { label: "Natação", value: "Natação" },
          { label: "Corrida", value: "Corrida" },
        ]}
        placeholder="Selecione um esporte"
        mode="dialog"
      />
      {/* Tags selecionadas para seleção múltipla */}
      {selectedSports.length > 0 && (
        <View className="mb-2 w-full items-center">
          <View className="w-[80%]">
            <Text className="font-[Poppins-Bold] mb-2 text-sm">
              Selecionados:
            </Text>
            <View className="flex-row flex-wrap">
              {selectedSports.map((value) => (
                <View
                  key={value}
                  className="bg-[#40B843]  rounded-lg px-3 py-1 mr-2 mb-2 flex-row items-center"
                >
                  <Text className="text-white text-sm">{value}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setSelectedSports(
                        selectedSports.filter((v) => v !== value)
                      )
                    }
                    className="ml-2"
                  >
                    <Text className="text-white font-bold">×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
      <LargeButton
        onPress={() => {
          handleCreateAccount();
        }}
        title="Criar Conta"
      />

   <Modal visible={codeModalVisible} transparent animationType="slide" onRequestClose={() => setCodeModalVisible(false)}>
        <View className="flex-1 bg-[rgba(0,0,0,0.4)] items-center justify-center px-6">
          <View className="w-full bg-white rounded-2xl p-5">
            <Text className="text-lg font-bold mb-2">Verificar e-mail</Text>
            <Text className="text-gray-600 mb-4">
              Enviamos um código para <Text className="font-semibold">{form.email}</Text>. Digite-o abaixo para confirmar.
            </Text>

            <TextInput
              label="Código de verificação"
              placeholder="123456"
              value={emailCode}
              onChangeText={setEmailCode}
              keyboardType="number-pad"
            />

            <LargeButton onPress={handleConfirmCode} title={loading ? "Confirmando..." : "Confirmar código"} />

            <TouchableOpacity onPress={handleResendCode} style={{ marginTop: 10 }}>
              <Text className="text-center underline">Reenviar código</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCodeModalVisible(false)} style={{ marginTop: 6 }}>
              <Text className="text-center text-gray-500">Cancelar</Text>
            </TouchableOpacity>

            {loading && (
              <View className="mt-3 items-center">
                <ActivityIndicator />
              </View>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}
