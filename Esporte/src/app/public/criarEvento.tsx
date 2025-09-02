// Caminho do arquivo: src/app/public/criarEvento.tsx
import React, { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ScreenHeader } from "../../components/ScreenHeader";
import { ImageUploader } from "../../components/ImageUploader";
import { FormInput } from "../../components/FormInput";
import { EventDateTimePicker } from "../../components/EventDateTimePicker";
import { OptionSelector } from "../../components/OptionSelector";
import { ParticipantCounter } from "../../components/ParticipantCounter";
import { DescriptionInput } from "../../components/DescriptionInput";
import { SubmitButton } from "../../components/SubmitButton";
import { PrivacyToggle } from "../../components/PrivacyToggle";

const sportOptions = [
  "Futebol",
  "Vôlei",
  "Basquete",
  "Yoga",
  "Corrida",
  "Tênis",
  "Pedal",
  "Beach Tennis",
  "Hot Yoga",
  "Futevôlei",
  "Vôlei de praia",
  "Pilates",
  "Paddle",
  "Pickleball",
];
const levelOptions = [
  "Iniciante",
  "Intermediario",
  "Avançado",
  "Semi-profissional",
];
const genderOptions = ["Masculino", "Feminino", "Mix"];

export default function CreateEventScreen() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("120");
  const [whats, setWhats] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date(0, 0, 0, 16, 30));
  const [endTime, setEndTime] = useState(new Date(0, 0, 0, 16, 30));
  const [sports, setSports] = useState<string[]>(["Vôlei"]);
  const [level, setLevel] = useState("Iniciante");
  const [gender, setGender] = useState("Masculino");
  const [minPart, setMinPart] = useState(6);
  const [maxPart, setMaxPart] = useState(6);
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const toggleSport = (s: string) => {
    setSports((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleCreateEvent = () => {
    console.log("Evento criado com os dados:", {
      name,
      location,
      price,
      date,
      startTime,
      endTime,
      sports,
      level,
      gender,
      minPart,
      maxPart,
      description,
      isPrivate,
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-[#F7FFED]"
      contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="px-7 pt-14">
        <ScreenHeader title="Criar evento" />
        <ImageUploader />

        <FormInput
          value={name}
          onChangeText={setName}
          placeholder="Nome do evento"
        />
        <FormInput
          value={location}
          onChangeText={setLocation}
          placeholder="Localização"
        />
        <FormInput
          value={price}
          onChangeText={(t) => setPrice(t.replace(/\D/g, ""))}
          placeholder="Valor total do aluguel"
          keyboardType="numeric">
          <Text className="text-[#212121] ml-2">R$ {price || "0"}</Text>
        </FormInput>
        <FormInput
          value={whats}
          onChangeText={setWhats}
          placeholder="WhatsApp link (opcional)"
          autoCapitalize="none">
          <FontAwesome name="whatsapp" size={22} color="#10CF65" />
        </FormInput>

        <PrivacyToggle value={isPrivate} onValueChange={setIsPrivate} />

        <EventDateTimePicker
          date={date}
          setDate={setDate}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
        />

        <OptionSelector
          title="Modalidade"
          options={sportOptions}
          selectedValues={sports}
          onSelect={toggleSport}
          isMultiSelect
        />
        <OptionSelector
          title="Nível"
          options={levelOptions}
          selectedValues={level}
          onSelect={setLevel}
        />
        <OptionSelector
          title="Gênero"
          options={genderOptions}
          selectedValues={gender}
          onSelect={setGender}
        />

        <ParticipantCounter
          label={"Mínimo de\nparticipantes"}
          value={minPart}
          setValue={setMinPart}
        />
        <ParticipantCounter
          label={"Máximo de\nparticipantes"}
          value={maxPart}
          setValue={setMaxPart}
        />

        <DescriptionInput value={description} onChangeText={setDescription} />

        <SubmitButton title="Criar evento" onPress={handleCreateEvent} />
      </View>
    </ScrollView>
  );
}
