import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ConfirmarSenha() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [eventName, setEventName] = useState("");
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
        className="ml-2 text-[30px] absolute top-[50px] left-[79px] font-bold"
      />

      <TouchableOpacity
        onPress={pickImage}
        className="absolute top-[117px] left-[28px] w-[355px] h-[188px] rounded-[20px] overflow-hidden"
      >
        <Image
          source={eventImage}
          className="w-full h-full"
          resizeMode="cover"
        />
      </TouchableOpacity>
      <Text className="text-[30px] left-[30px] top-[330px] text-black font-bold">Descrição</Text>
      <TextInput
  multiline
  value={eventName}
  onChangeText={setEventName}
  placeholder={
    "Nesta área, será inserida a descrição do evento com informações adicionais, recomendações, dicas ou o que o criador do evento julgar necessário."
  }
  placeholderTextColor="#000000"
  className="ml-2 text-[16px] absolute top-[365px] left-[22px] w-[355px] textalign-justify"
/>



      

      <TouchableOpacity
        className="absolute top-[695px] left-[46px] w-[328px] h-[56px] bg-[#40B843] rounded-[20px] shadow-md flex items-center justify-center"
        onPress={() => {
          router.push("/auth");
        }}
      >
        <Text className="text-white text-lg top-[-3px] font-bold text-[20px] ml-2">Solicitar entrada</Text>
      </TouchableOpacity>
    </View>
  );
}