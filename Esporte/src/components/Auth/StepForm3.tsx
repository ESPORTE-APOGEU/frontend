import React from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { Gender } from "@/interfaces/SigupForm";
import useSignup from "@/hooks/Singup";
import LargeButton from "../ui/Forms/LargeButtom";
import DateInput from "../ui/Forms/DateInput";
import TextInput from "../ui/Forms/TextInput";
import DropDownInput from "../ui/Forms/DropDownInput";
import Autocomplete from "../ui/Forms/AutoCompleteTags";
import { useSignUp } from "@clerk/clerk-expo";
interface StepsSignupProps {
  onNext?: () => void;
}
type Option = {
  label: string;
  value: string;
};
export default function StepForm3({ onNext }: StepsSignupProps) {
  const [selectedCity, setSelectedCity] = React.useState<string>("");
  const [selectedSports, setSelectedSports] = React.useState<string[]>([]);
  const { form, setForm } = useSignup();
  const { signUp, setActive } = useSignUp();

  const handleCreateAccount = async () => {
    try {
      if (!signUp || !setActive) {
        throw new Error("Clerk SignUp not initialized");
      }
      // 1. Cria no Clerk
      const res = await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      // 👇 Você pode mostrar um modal solicitando o código, ou fazer direto se for automático
      await signUp.attemptEmailAddressVerification({ code: "123456" }); // <-- coloque o código real

      await setActive({ session: res.createdSessionId });

      // 2. Registra no backend
      await fetch("https://localhost:8080/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${res.createdSessionId}`, // opcional se backend validar token
        },
        body: JSON.stringify({
          id: res.id, // Clerk ID
          name: form.name,
          email: form.email,
          birthday: form.birthday,
          gender: form.gender,
          city: form.city,
          sports: form.sports,
        }),
      });

      Alert.alert("Conta criada com sucesso!");
    } catch (err: any) {
      console.error("Erro ao criar conta:", err);
      Alert.alert("Erro", err.message || "Erro inesperado");
    }
  };

  const getCidadesFormatadas = async (): Promise<Option[]> => {
    console.log("Buscando cidades formatadas...");
    const res = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
    );
    if (!res.ok) {
      throw new Error("Erro ao buscar cidades");
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error("Dados inválidos recebidos da API");
    }
    const options: Option[] = data
      .map((cidade: any, index: number) => {
        try {
          const nomeCidade = cidade.nome;
          const uf = cidade.microrregiao?.mesorregiao?.UF?.sigla;

          if (!nomeCidade || !uf) {
            return null;
          }

          const nomeFormatado = `${nomeCidade} - ${uf}`;

          return {
            label: nomeFormatado,
            value: nomeFormatado,
          };
        } catch (error) {
          console.error(`Erro ao processar cidade ${index}:`, error, cidade);
          return null;
        }
      })
      .filter(Boolean) as Option[]; // Remove entradas null

    return options;
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
    </View>
  );
}
