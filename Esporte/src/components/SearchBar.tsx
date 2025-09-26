import React from 'react';
import { View, TextInput, TouchableOpacity, Image, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
  onSearch?: (text: string) => void;
  containerStyle?: ViewStyle;  // opcional: caso queira ajustar fora
  inputStyle?: TextStyle;      // opcional
}

export default function SearchBar({
  placeholder = "Quem você procura",
  onChangeText,
  value,
  onSearch,
  containerStyle,
  inputStyle,
}: SearchBarProps) {
  return (
    <View
      style={[
        {
          height: 41,
          borderWidth: 0.8,
          borderColor: '#7A7676',
          borderRadius: 101,
          backgroundColor: 'transparent',   // <- sem fundo branco
          paddingHorizontal: 16,
          alignItems: 'center',
          flexDirection: 'row',
        },
        containerStyle,
      ]}
    >
      <Ionicons name="search" size={16} color="#7A7676" />

      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#7A7676"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={(e) => onSearch?.(e.nativeEvent.text)}
        style={[
          {
            flex: 1,
            marginLeft: 8,
            fontSize: 12,            // <- 12px como no Figma
            color: '#000000',
            paddingVertical: 0,      // evita “crescer” a altura
            backgroundColor: 'transparent',
          },
          inputStyle,
        ]}
      />
    </View>
  );
}
