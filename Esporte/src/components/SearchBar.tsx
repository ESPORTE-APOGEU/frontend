import React from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
}

export default function SearchBar({ 
  placeholder = "What are you looking for?", 
  onChangeText, 
  value 
}: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-white rounded-3xl px-6 py-2"
      style={{
        shadowOffset: { width: 0, height: 1 },
        borderRadius: 100,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#7A7676'
      }}
    >
      {/* Ícone de pesquisa */}
      <Ionicons name="search" size={18} color="#9CA3AF" />
      
      {/* Campo de input */}
      <TextInput
        className="flex-1 text-gray-700 ml-3"
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        style={{ fontSize: 14 }}
      />
    </View>
  );
}
