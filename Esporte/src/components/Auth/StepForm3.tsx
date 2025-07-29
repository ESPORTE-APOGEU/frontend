import React from 'react';
import { View, Text, Pressable, Alert } from "react-native";
import { Gender } from '@/interfaces/SigupForm';
import useSignup from '@/hooks/Singup';
import LargeButton from "../ui/Forms/LargeButtom";
import TextInput from '../ui/Forms/TextInput';
import DropDownInput from '../ui/Forms/DropDownInput';

import Autocomplete from '../ui/Forms/AutoCompleteTags';
interface StepsSignupProps {
  onNext?: () => void;
}
type Option = {
  label: string;
  value: string;
};
export default function StepForm3({ onNext }: StepsSignupProps) {
  const [selectedCity, setSelectedCity] = React.useState<string>('');
  const [selectedSport, setSelectedSport] = React.useState<string>('');
  const { form, setForm } = useSignup();

  const getCidadesFormatadas = async (): Promise<Option[]> => {
  console.log("Buscando cidades formatadas...");
  const res = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios");
  if (!res.ok) {
    throw new Error("Erro ao buscar cidades");
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Dados inválidos recebidos da API");
  }
  const options: Option[] = data.map((cidade: any, index: number) => {
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
  }).filter(Boolean) as Option[]; // Remove entradas null
  
  return options;
};
  return (
    <View>
        <TextInput
          label="Idade"
          placeholder="digite a sua idade"
          keyboardType="numeric"
          value={form.age ? String(form.age) : ''}
          onChangeText={(text) => setForm({ ...form, age: Number(text) })}
        />
  

        <DropDownInput
          label="Gênero"
          selectedValue={form.gender ?? ''}
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
            setSelectedCity('');
            setForm({ ...form, city: '' });
          }}
        />
        <DropDownInput
          label='Esportes'
          selectedValue={selectedSport ?? ''}
          onValueChange={(value) => setSelectedSport(value)}
          options={[
            { label: "Futebol", value: "Futebol" },
            { label: "Basquete", value: "Basquete" },
            { label: "Vôlei", value: "Vôlei" },
            { label: "Natação", value: "Natação" },
            { label: "Corrida", value: "Corrida" },
          ]}
          placeholder="Selecione seu estado"
          mode="dialog"
        />        
        

        <LargeButton onPress={() => { Alert.alert("Conta criada com sucesso!"); }} title="Criar Conta" />
    </View>
  );
}
