// src/app/public/criarEvento.tsx
import React, { useState } from "react";
import { ScrollView, View, Text, Alert } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ScreenHeader } from "../../components/ScreenHeader";
import { ImageUploader } from "../../components/ImageUploader";
// 👇 caminho corrigido
import { FormInput } from "../../components/FormInput";
import { EventDateTimePicker } from "../../components/EventDateTimePicker";
import { OptionSelector } from "../../components/OptionSelector";
import { ParticipantCounter } from "../../components/ParticipantCounter";
import { DescriptionInput } from "../../components/DescriptionInput";
import { SubmitButton } from "../../components/SubmitButton";
import { PrivacyToggle } from "../../components/PrivacyToggle";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const sportOptions = ["Futebol","Vôlei","Basquete","Yoga","Corrida","Tênis","Pedal","Beach Tennis","Hot Yoga","Futevôlei","Vôlei de praia","Pilates","Paddle","Pickleball"];
const levelOptions = ["Iniciante", "Intermediario", "Avançado", "Semi-profissional"];
const genderOptions = ["Masculino", "Feminino", "Mix"];

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const pad2 = (n: number) => n.toString().padStart(2, "0");
const toDate = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const toTime = (d: Date) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}:00`;

const makeTodayTime = (h: number, m: number) => {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};
export default function CreateEventScreen() {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [name, setName] = useState("");
  // 🟢 renomeado para evitar colisão com global location
  const [place, setPlace] = useState("");
  const [price, setPrice] = useState("120");
  const [whats, setWhats] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(makeTodayTime(16, 30));
  const [endTime, setEndTime]   = useState(makeTodayTime(16, 30));
  const [sport, setSport] = useState("Vôlei");
  const [level, setLevel] = useState("Iniciante");
  const [gender, setGender] = useState("Masculino");
  const [minPart, setMinPart] = useState(6);
  const [maxPart, setMaxPart] = useState(6);
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCreateEvent = async () => {
    try {
      if (!isLoaded || !isSignedIn) {
        Alert.alert("Ops", "Você precisa estar autenticado para criar eventos.");
        return;
      }
      if (!name.trim() || !place.trim() || !sport) {
        Alert.alert("Campos obrigatórios", "Preencha nome, localização e modalidade.");
        return;
      }
      if (!BACKEND_URL) {
        Alert.alert("Configuração", "EXPO_PUBLIC_BACKEND_URL não definida.");
        return;
      }

      setSubmitting(true);

      const jwt =
        (await getToken({ template: "backend", skipCache: true })) ||
        (await getToken({ template: "backend" }));
      if (!jwt) throw new Error("Não foi possível obter o token do Clerk.");

const payload = {
        name: name.trim(),
        location: place.trim(),
        sport,
        level,
        gender,
        date: toDate(date),
        startTime: toTime(startTime),
        endTime: toTime(endTime),
        price: Number(price || 0),
        
        // Dados estruturados (melhor prática)
        description: description.trim(),
        whatsappLink: whats.trim(),
        isPrivate: isPrivate,
        
        // Campos que estavam faltando
        minParticipants: minPart,
        maxParticipants: maxPart,

        // Coordenadas (ainda como TODO)
        latitude: null,
        longitude: null,
      };

      const res = await fetch(`${BACKEND_URL}/api/v1/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Falha ao criar evento (${res.status}): ${txt}`);
      }

      Alert.alert("Sucesso", "Evento criado!", [
        { text: "OK", onPress: () => router.replace("/auth/home") },
      ]);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Erro", err?.message ?? "Não foi possível criar o evento.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#F7FFED]"
      contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"   // 👈 evita alguns crashes no Android
    >
      <View className="px-7 pt-14">
        <ScreenHeader title="Criar evento" />
        <ImageUploader />

        <FormInput value={name} onChangeText={setName} placeholder="Nome do evento" />
        <FormInput value={place} onChangeText={setPlace} placeholder="Localização" />

        <FormInput
          value={price}
          onChangeText={(t) => setPrice((t ?? "").replace(/\D/g, ""))} // 👈 defensivo
          placeholder="Valor total do aluguel"
          keyboardType="numeric"
        >
          <Text className="text-[#212121] ml-2">R$ {price || "0"}</Text>
        </FormInput>

        <FormInput
          value={whats}
          onChangeText={setWhats}
          placeholder="WhatsApp link (opcional)"
          autoCapitalize="none"
        >
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
          selectedValues={sport}
          onSelect={setSport}
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

        <ParticipantCounter label={"Mínimo de\nparticipantes"} value={minPart} setValue={setMinPart} />
        <ParticipantCounter label={"Máximo de\nparticipantes"} value={maxPart} setValue={setMaxPart} />

        <DescriptionInput value={description} onChangeText={setDescription} />

        <SubmitButton title={submitting ? "Enviando..." : "Criar evento"} onPress={handleCreateEvent} />
      </View>
    </ScrollView>
  );
}
