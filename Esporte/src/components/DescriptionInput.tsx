import React from "react"; // Certifique-se de que o React está importado
import { View, Text, TextInput } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

// Use React.FC (Function Component) para tipar o componente
export const DescriptionInput: React.FC<Props> = ({ value, onChangeText }) => {
  return (
    <View>
      <Text className="text-black font-medium text-[20px] mb-2">Descrição</Text>
      <View className="w-full h-[95px] rounded-xl border border-black px-3 shadow">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Escreva aqui a descrição do seu evento"
          placeholderTextColor="rgba(0,0,0,0.5)"
          multiline
          className="flex-1 text-black pt-2"
        />
      </View>
    </View>
  );
};
