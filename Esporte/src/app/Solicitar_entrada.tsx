import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { requestEventEntry } from "../services/EventEntryService";
import axios from "axios";

export default function ConfirmarSenha() {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [participants, setParticipants] = useState<{ name: string }[]>([
    {
      name: "Diego Alcantara"
    }
  ]);
  const eventId = 3; // substitua pelo ID do evento que você deseja buscar

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://192.168.100.10:8080/api/v1/events/${eventId}`);
        setEventName(response.data.name);
        setEventDescription(response.data.description);
        setOrganizer(response.data.organizerPhoto);
        setOrganizerName(response.data.organizerName);
      } catch (error) {
        console.error("Erro ao buscar evento:", error);
      }
    };
    fetchEvent();
  }, []);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(`http://192.168.100.10:8080/api/v1/events/${eventId}/participants`);
        // Verifique se os dados têm o formato esperado e adapte o estado
        const formattedParticipants = response.data.map((user: { name: any; }) => ({
          name: user.name || 'Usuário sem nome'
        }));
        setParticipants(formattedParticipants);
      } catch (error) {
        console.error("Erro ao buscar participantes:", error);
        // Mantenha os participantes padrão em caso de erro
      }
    };
    fetchParticipants();
  }, []);

  const handleSolicitarEntrada = async () => {
    try {
      const data = await requestEventEntry(3, 123); // substitua os valores conforme necessário
      Alert.alert("Sucesso", data.message);
      router.push("/auth");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  return (
    <View className="flex-1 bg-[#FFFFFF]">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 180 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          className="absolute top-[56px] left-[30px] z-50"
          onPress={() => {
            router.push("/auth");
          }}
        >
          <Text className="text-[40px] text-green-600">{'<'}</Text>
          <Image
            source={require("../assets/images/Vector (3).png")}
            className="absolute top-[8px] right-[-325px] w-[30px] h-[30px]"
          />
        </TouchableOpacity>

        {/* Transformado de TextInput para Text */}
        <Text className="ml-3 text-[27px] mt-[50px] mb-6 left-[110px] top-[10px] font-bold">
          {eventName || "Nome do evento"}
        </Text>

        <Image
          source={require("../assets/images/tela.png")}
          className="mt-[20px] left-[28px] w-[355px] h-[188px] rounded-[20px] overflow-hidden"
          resizeMode="cover"
        />

        <Text className="text-[25px] ml-[30px] mt-[30px] text-black font-bold">
          Descrição
        </Text>
        
        {/* Transformado de TextInput para Text */}
        <Text className="ml-2 text-[16px] mt-1 left-[22px] w-[355px]">
          { "Nesta área, será inserida a descrição do evento com informações adicionais, recomendações, dicas ou o que o criador do evento julgar necessário."}
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
                Domingo, 15 de maio , 2025
              </Text>
              <Text className="text-[14px] text-black">
                16:30 - 18:00 (90 min)
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
                Ibirapuera Park - Vila Mariana  &gt;
              </Text>
              <Text className="text-[14px] text-black">
                Valor de entrada $40
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
                Iniciante
              </Text>
              <Text className="text-[14px] text-black">
                {/* Adicione informação extra se necessário */}
              </Text>
            </View>
          </View>

          {/* Masculino */}
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
            <View className="flex-col ">
              <Text className="text-[16px] font-bold top-[-1px] text-black">
                Masculino
              </Text>
            </View>
          </View>
        </View>

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

        <Text className="text-[25px] ml-[30px] top-[30px] text-black font-bold">
          Participantes
        </Text>
        {participants.length > 0 ? (
          participants.map((participant, index) => (
            <View className="flex-row items-center ml-[30px] top-[50px]" key={index}>
              <View className="relative w-[40px] h-[38px] mr-4">
                <Image
                  source={require("../assets/images/participante.png")}
                  className="w-[40px] h-[38px]"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-col">
                <Text className="text-[16px] font-bold top-[0px] text-black">
                  {participant.name}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-[16px] text-gray-500 ml-[30px] top-[50px]">
            Nenhum participante.
          </Text>
        )}
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