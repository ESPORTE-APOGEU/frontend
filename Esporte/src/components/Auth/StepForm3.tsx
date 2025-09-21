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
import TextInput from "../ui/Forms/TextInput";
import { useAuth, useSignUp, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

interface StepsSignupProps {
  onNext?: () => void;
  form: SignupForm;
  setForm: React.Dispatch<React.SetStateAction<SignupForm>>;
}
type Option = { label: string; value: string };

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function StepForm3({ form, setForm }: StepsSignupProps) {
  const router = useRouter();

  // estados do formulário
  const [selectedCity, setSelectedCity] = React.useState(form.city ?? "");
  const [selectedSports, setSelectedSports] = React.useState<string[]>(
    form.sports ?? []
  );

  // Clerk
  const { isSignedIn, getToken } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const { signUp, setActive, isLoaded: signUpLoaded } = useSignUp();

  // verificação por código (e-mail/senha)
  const [codeModalVisible, setCodeModalVisible] = React.useState(false);
  const [emailCode, setEmailCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setForm((prev) => ({ ...prev, sports: selectedSports }));
  }, [selectedSports]);

  React.useEffect(() => {
    setForm((prev) => ({ ...prev, city: selectedCity }));
  }, [selectedCity]);

  // -------- helpers de auth/fetch --------

  const getFreshToken = async () => {
    // tenta token “fresco”; se vier null, tenta sem skipCache como fallback
    return (
      (await getToken({ template: "backend", skipCache: true })) ||
      (await getToken({ template: "backend" }))
    );
  };

  const fetchWithJwt = async (
    path: string,
    init?: RequestInit,
    doRetry401 = true
  ): Promise<Response> => {
    let jwt = await getFreshToken();
    if (!jwt) throw new Error("Não foi possível obter o token do Clerk.");

    const res = await fetch(`${BACKEND_URL}${path}`, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${jwt}`,
      } as any,
    });

    if (res.status === 401 && doRetry401) {
      // token possivelmente cacheado/antigo → pega outro e tenta de novo
      jwt = await getFreshToken();
      if (!jwt) return res;
      return fetch(`${BACKEND_URL}${path}`, {
        ...init,
        headers: {
          ...(init?.headers || {}),
          Authorization: `Bearer ${jwt}`,
        } as any,
      });
    }

    return res;
  };

  const normalizeGender = (g: any): string | null => {
    if (!g) return null;
    const s = typeof g === "string" ? g : String(g);
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  };

  const serializePayload = () => {
    const birthday =
      form.birthday instanceof Date
        ? form.birthday.toISOString().slice(0, 10) // yyyy-mm-dd
        : form.birthday ?? null;

    return {
      name: form.name || "",
      email: form.email || "",
      birthday,
      gender: normalizeGender(form.gender),
      city: form.city || "",
      sports: Array.isArray(form.sports) ? form.sports : [],
    };
  };

  const checkProfileExists = async (): Promise<"exists" | "missing" | "unauth" | "error"> => {
    try {
      const res = await fetchWithJwt(`/api/v1/users/me`, { method: "GET" });
      if (res.ok) return "exists";
      if (res.status === 404) return "missing";
      if (res.status === 401) return "unauth";
      return "error";
    } catch {
      return "error";
    }
  };

  const upsertMe = async () => {
    const body = serializePayload();
    const res = await fetchWithJwt(`/api/v1/users/me`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Falha ao salvar perfil (${res.status}): ${txt}`);
    }
  };

  // -------- handlers principais --------

  const handleCreateAccount = async () => {
    try {
      setLoading(true);

      // 1) Se já estiver logado (SSO), tente pular direto:
      if (isSignedIn && userLoaded && user) {
        const state = await checkProfileExists();
        if (state === "exists") {
          router.replace("/auth/home");
          return;
        }
        if (state === "missing") {
          await upsertMe();
          router.replace("/auth/home");
          return;
        }
        if (state === "unauth") {
          Alert.alert("Sessão inválida", "Faça login novamente.");
          return;
        }
        throw new Error("Não foi possível verificar seu perfil.");
      }

      // 2) Fluxo e-mail/senha: cria no Clerk e envia código
      if (!signUpLoaded) throw new Error("Clerk SignUp ainda não carregou.");
      if (!signUp || !setActive) throw new Error("Clerk SignUp não inicializado.");

      await signUp.create({ emailAddress: form.email, password: form.password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
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

      // agora autenticado → mesmo fluxo do SSO: checa/me e upsert se precisar
      const state = await checkProfileExists();
      if (state === "exists") {
        setCodeModalVisible(false);
        setEmailCode("");
        router.replace("/auth/home");
        return;
      }
      if (state === "missing") {
        await upsertMe();
        setCodeModalVisible(false);
        setEmailCode("");
        router.replace("/auth/home");
        return;
      }
      if (state === "unauth") {
        throw new Error("Sessão inválida após verificação. Tente entrar novamente.");
      }
      throw new Error("Não foi possível verificar seu perfil após o código.");
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

  // -------- opções IBGE --------
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

      {selectedSports.length > 0 && (
        <View className="mb-2 w-full items-center">
          <View className="w-[80%]">
            <Text className="font-[Poppins-Bold] mb-2 text-sm">Selecionados:</Text>
            <View className="flex-row flex-wrap">
              {selectedSports.map((value) => (
                <View
                  key={value}
                  className="bg-[#40B843]  rounded-lg px-3 py-1 mr-2 mb-2 flex-row items-center"
                >
                  <Text className="text-white text-sm">{value}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setSelectedSports(selectedSports.filter((v) => v !== value))
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

      <LargeButton onPress={handleCreateAccount} title={loading ? "Enviando..." : "Criar Conta"} />

      {/* Modal de verificação por e-mail (somente para e-mail/senha) */}
      <Modal
        visible={codeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCodeModalVisible(false)}
      >
        <View className="flex-1 bg-[rgba(0,0,0,0.4)] items-center justify-center px-6">
          <View className="w-full bg-white rounded-2xl p-5">
            <Text className="text-lg font-bold mb-2">Verificar e-mail</Text>
            <Text className="text-gray-600 mb-4">
              Enviamos um código para{" "}
              <Text className="font-semibold">{form.email}</Text>. Digite-o abaixo para confirmar.
            </Text>

            <TextInput
              label="Código de verificação"
              placeholder="123456"
              value={emailCode}
              onChangeText={setEmailCode}
              keyboardType="number-pad"
            />

            <LargeButton
              onPress={handleConfirmCode}
              title={loading ? "Confirmando..." : "Confirmar código"}
            />

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
