import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { requestEventEntry } from "../services/EventEntryService";
import axios from "axios";

// Definição da interface para os participantes
interface Participant {
    name: string;
    photo: string;
}

export default function ConfirmarSenha() {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [eventGender, setEventGender] = useState("");
  const [price, setPrice] = useState("");
  // Altere aqui para um array vazio tipado
  const [participants, setParticipants] = useState<Participant[]>([]);
  const eventId = 3; // substitua pelo ID do evento que você deseja buscar

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://192.168.100.10:8080/api/v1/events/${eventId}`);
        console.log("Dados do evento:", response.data);
        setEventName(response.data.name);
        setEventDescription(response.data.description);
        setOrganizer(response.data.organizerPhoto);
        setOrganizerName(response.data.organizerName);
        setEventLocation(response.data.location);
        setEventDate(response.data.date);
        setEventStartTime(response.data.startTime);
        setEventEndTime(response.data.endTime);
        setEventLevel(response.data.level);
        setEventGender(response.data.gender);
        setPrice(response.data.price);
        console.log(response.data);
      } catch (error) {
        console.error("Erro ao buscar evento:", error);
        Alert.alert("Erro", "Não foi possível carregar os detalhes do evento.");
      }
    };
    fetchEvent();
  }, []);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(`http://192.168.100.10:8080/api/v1/events/${eventId}/participants`);
        setParticipants(response.data);
      } catch (error) {
        console.error("Erro ao buscar participantes:", error);
      }
    };
    fetchParticipants();
  }, []);

  const handleSolicitarEntrada = async () => {
    try {
      const data = await requestEventEntry(eventId, 123); // substitua os valores conforme necessário
      Alert.alert("Sucesso", data.message);
      router.push("/auth");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  return (
    <View className="flex-1 bg-[#FFFFFF]">
      <ScrollView contentContainerStyle={{ paddingBottom: 180 }} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          className="absolute top-[56px] left-[30px] z-50"
          onPress={() => { router.push("/auth"); }}
        >
          <Text className="text-[40px] text-green-600">{'<'}</Text>
          <Image
            source={require("../assets/images/Vector (3).png")}
            className="absolute top-[8px] right-[-325px] w-[30px] h-[30px]"
          />
        </TouchableOpacity>

        {/* Exibição do nome do evento (não editável) */}
        <Text className="ml-2 text-[27px] top-[10px] mt-[50px] mb-4 left-[115px] font-bold">
          {eventName}
        </Text>

        <Image
          source={require("../assets/images/tela.png")}
          className="mt-[20px] left-[28px] w-[355px] h-[188px] rounded-[20px] overflow-hidden"
          resizeMode="cover"
        />

        {/* Exibição da descrição (não editável) */}
        <Text className="text-[25px] ml-[30px] mt-[30px] text-black font-bold">
          Descrição
        </Text>
        <Text className="ml-2 text-[16px] mt-1 left-[22px] w-[355px] textalign-justify">
          {eventDescription}
        </Text>

        {/* Bloco de informações */}
        <View className="mt-8 space-y-4">
          {/* Calendário */}
          <View className="flex-row items-center ml-[30px]">
            <View className="relative w-[40px] h-[38px] mr-4">
              <Image
                source={require("../assets/images/RETANGULO.png")}
                className="w-[40px] h-[38px]"
                resizeMode="cover"
              />
              <Image
                source={require("../assets/images/calendario.png")}
                className="absolute w-[22px] h-[22px] left-[9px] top-[8px]"
                resizeMode="contain"
              />
            </View>
            <View className="flex-col">
              <Text className="text-[16px] font-bold text-black">
                {eventDate }
              </Text>
              <Text className="text-[14px] text-black">
                {eventStartTime && eventEndTime ? `${eventStartTime} - ${eventEndTime}` : ""}
              </Text>
            </View>
          </View>

          {/* Localização */}
          <View className="flex-row items-center ml-[30px]">
            <View className="relative w-[40px] h-[38px] mr-4">
              <Image
                source={require("../assets/images/RETANGULO.png")}
                className="w-[40px] h-[38px]"
                resizeMode="cover"
              />
              <Image
                source={require("../assets/images/localização.png")}
                className="absolute w-[22px] h-[22px] left-[9px] top-[8px]"
                resizeMode="contain"
              />
            </View>
            <View className="flex-col">
              <Text className="text-[16px] font-bold text-black">
                {eventLocation}
              </Text>
              <Text className="text-[14px] text-black">
                {price}
              </Text>
            </View>
          </View>

          {/* Conexão */}
          <View className="flex-row items-center ml-[30px]">
            <View className="relative w-[40px] h-[38px] mr-4">
              <Image
                source={require("../assets/images/CIRCULO.png")}
                className="w-[40px] h-[38px]"
                resizeMode="cover"
              />
              <Image
                source={require("../assets/images/conexao.png")}
                className="absolute w-[22px] h-[20px] left-[9px] top-[9px]"
                resizeMode="contain"
              />
            </View>
            <View className="flex-col">
              <Text className="text-[16px] font-bold top-[8px] text-black">
                {eventLevel}
              </Text>
              <Text className="text-[14px] text-black">
                {/* Adicione informação extra se necessário */}
              </Text>
            </View>
          </View>

          {/* Gênero */}
          <View className="flex-row items-center ml-[170px] top-[-55px]">
            <View className="relative w-[40px] h-[38px] mr-4">
              <Image
                source={require("../assets/images/CIRCULO.png")}
                className="w-[40px] h-[38px]"
                resizeMode="cover"
              />
              <Image
                source={require("../assets/images/masculino.png")}
                className="absolute w-[22px] h-[22px] left-[9px] top-[8px]"
                resizeMode="contain"
              />
            </View>
            <View className="flex-col">
              <Text className="text-[16px] font-bold top-[-1px] text-black">
                {eventGender}
              </Text>
            </View>
          </View>
        </View>

        {/* Organizador do evento */}
        <Text className="text-[25px] ml-[30px] top-[-30px] text-black font-bold">
          Organizador do evento
        </Text>
        <View className="flex-row items-center ml-[30px]">
          <View className="relative w-[40px] h-[38px] mr-4">
            <Image
              source={{ uri: organizer }}
              className="w-[40px] h-[38px]"
              resizeMode="cover"
            />
          </View>
          <View className="flex-col">
            <Text className="text-[16px] font-bold top-[8px] text-black">
              {organizerName}
            </Text>
          </View>
        </View>

        {/* Participantes */}
        <Text className="text-[25px] ml-[30px] top-[30px] text-black font-bold">
          Participantes
        </Text>
        {participants.map((participant, index) => (
          <View className="flex-row items-center ml-[30px] top-[50px]" key={index}>
            <View className="relative w-[40px] h-[38px] mr-4">
              <Image
                source={participant.photo ? { uri: participant.photo } : require("../assets/images/participante.png")}
                className="w-[40px] h-[38px]"
                resizeMode="cover"
              />
            </View>
            <View className="flex-col">
              <Text className="text-[16px] font-bold top-[8px] text-black">
                {participant.name}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Botão fixo */}
      <TouchableOpacity
        className="absolute bottom-8 left-[46px] w-[328px] h-[56px] bg-[#40B843] rounded-[20px] shadow-md flex items-center justify-center z-50"
        onPress={handleSolicitarEntrada}
      >
        <Text className="text-white text-lg font-bold text-[20px] ml-2">
          Solicitar entrada
        </Text>
      </TouchableOpacity>
    </View>
  );
}