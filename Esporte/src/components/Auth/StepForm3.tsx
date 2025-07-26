import React from 'react';
import { View, Text, Pressable, Alert } from "react-native";
import { Gender } from '@/interfaces/SigupForm';
import useSignup from '@/hooks/singup';
import LargeButton from "../ui/Forms/LargeButtom";
import TextInput from '../ui/Forms/TextInput';
import DropDownInput from '../ui/Forms/DropDownInput';
import SearchAndSelectList from '../ui/Forms/SearchAndSelectList';
import SearchAndSelectOne from '../ui/Forms/SearchAndSelectOne';
import Autocomplete from '../ui/Forms/AutoCompleteTags';
interface StepsSignupProps {
  onNext?: () => void;
}
export default function StepForm3({ onNext }: StepsSignupProps) {
  const[selects,setSelects] = React.useState<any[]>([]);
  const { form, setForm } = useSignup();
    const handleNext = () => {
      if (onNext) {
        onNext();
      }
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

        <SearchAndSelectOne
          label="Cidade"
          selectedValue={form.city}
          onValueChange={(value) => setForm({ ...form, city: value ?? '' })}
          options={[
            { label: "São Paulo", value: "São Paulo" },
            { label: "Rio de Janeiro", value: "Rio de Janeiro" },
            { label: "Belo Horizonte", value: "Belo Horizonte" },
          ]}
          placeholder="Selecione sua cidade"
        />
        <SearchAndSelectList
          label="Esportes"
          selectedValues={selects}
          onValuesChange={(values) => setSelects(values)}
          onSearch={(query) => {
            // Aqui você pode implementar a lógica de busca
            console.log("Buscando por:", query);
          }}
          options={[
            { label: "Futebol", value: "Futebol" },
            { label: "Basquete", value: "Basquete" },
            { label: "Vôlei", value: "Vôlei" },
            { label: "Natação", value: "Natação" },
          ]}
          placeholder="Selecione seus esportes"
        />
        <LargeButton onPress={() => { Alert.alert("Conta criada com sucesso!"); }} title="Criar Conta" />
    </View>
  );
}
