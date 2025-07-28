import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ConfirmarSenha() {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventImage, setEventImage] = useState(require("../assets/images/tela.png"));

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [384, 188],
      quality: 1,
    });
    if (!result.canceled) {
      setEventImage({ uri: result.assets[0].uri });
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

        <TextInput
          value={eventName}
          onChangeText={setEventName}
          placeholder="Nome do evento"
          placeholderTextColor="#000000"
          className="ml-2 text-[28px] mt-[50px] mb-2 left-[82px] font-bold"
        />

        <TouchableOpacity
          onPress={pickImage}
          className="mt-[20px] left-[28px] w-[355px] h-[188px] rounded-[20px] overflow-hidden"
        >
          <Image
            source={eventImage}
            className="w-full h-full"
            resizeMode="cover"
          />
        </TouchableOpacity>

        <Text className="text-[25px] ml-[30px] mt-[30px] text-black font-bold">
          Descrição
        </Text>
        <TextInput
          multiline
          value={eventDescription}
          onChangeText={setEventDescription}
          placeholder="Nesta área, será inserida a descrição do evento com informações adicionais, recomendações, dicas ou o que o criador do evento julgar necessário."
          placeholderTextColor="#000000"
          className="ml-2 text-[16px] mt-1 left-[22px] w-[355px] textalign-justify"
        />

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
        </Text><View className="flex-row items-center ml-[30px]">
            <View className="relative w-[40px] h-[38px] mr-4">
              <Image
                source={require("../assets/images/Criador.png")}
                className="w-[40px] h-[38px]"
                resizeMode="cover"
              />
              
            </View>
            <View className="flex-col">
              <Text className="text-[16px] font-bold top-[8px] text-black">
                Samara Santos
              </Text>
              <Text className="text-[14px] text-black">
                {/* Adicione informação extra se necessário */}
              </Text>
            </View>
          </View>
        
        <Text className="text-[25px] ml-[30px] top-[30px] text-black font-bold">
          Participantes
        </Text>
          <View className="flex-row items-center ml-[30px] top-[50px] ">
            <View className="relative w-[40px] h-[38px] mr-4">
              <Image
                source={require("../assets/images/participante.png")}
                className="w-[40px] h-[38px]"
                resizeMode="cover"
              />
              
            </View>
            <View className="flex-col">
              <Text className="text-[16px] font-bold top-[8px] text-black">
                Diego Alcantara
              </Text>
              <Text className="text-[14px] text-black">
                {/* Adicione informação extra se necessário */}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center ml-[30px] top-[70px] ">
            <View className="relative w-[40px] h-[38px] mr-4">
              <Image
                source={require("../assets/images/participante.png")}
                className="w-[40px] h-[38px]"
                resizeMode="cover"
              />
              
            </View>
            <View className="flex-col">
              <Text className="text-[16px] font-bold top-[8px] text-black">
                Diego Alcantara
              </Text>
              <Text className="text-[14px] text-black">
                {/* Adicione informação extra se necessário */}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center ml-[30px] top-[90px] ">
            <View className="relative w-[40px] h-[38px] mr-4">
              <Image
                source={require("../assets/images/participante.png")}
                className="w-[40px] h-[38px]"
                resizeMode="cover"
              />
              
            </View>
            <View className="flex-col">
              <Text className="text-[16px] font-bold top-[8px] text-black">
                Diego Alcantara
              </Text>
              <Text className="text-[14px] text-black">
                {/* Adicione informação extra se necessário */}
              </Text>
            </View>
          </View>
        
      </ScrollView>

      {/* Botão fixo */}
      <TouchableOpacity
        className="absolute bottom-8 left-[46px] w-[328px] h-[56px] bg-[#40B843] rounded-[20px] shadow-md flex items-center justify-center z-50"
        onPress={() => {
          router.push("/auth");
        }}
      >
        <Text className="text-white text-lg font-bold text-[20px] ml-2">
          Solicitar entrada
        </Text>
      </TouchableOpacity>
    </View>
  );
}