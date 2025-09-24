import React, { useState } from "react";
import { View, Image, Pressable, Text, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export function ImageUploader({
  value,
  onChange,
}: {
  value?: string | null;                  // URL local para preview
  onChange?: (localUri: string | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(value ?? null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão", "Precisamos do acesso às fotos.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: [16, 9],
    });
    if (!res.canceled && res.assets?.length) {
      const uri = res.assets[0].uri;
      setPreview(uri);
      onChange?.(uri);
    }
  };

  return (
    <Pressable
      onPress={pickImage}
      className="w-full h-40 rounded-2xl bg-white items-center justify-center mb-4"
      style={{ borderWidth: 1, borderColor: "#e5e7eb" }}
    >
      {preview ? (
        <Image
          source={{ uri: preview }}
          style={{ width: "100%", height: "100%", borderRadius: 16 }}
          resizeMode="cover"
        />
      ) : (
        <View className="items-center">
          <Text className="text-[#6b7280]">Toque para adicionar a foto do evento</Text>
          <Text className="text-[#9ca3af] text-xs mt-1">16:9 recomendado</Text>
        </View>
      )}
    </Pressable>
  );
}
