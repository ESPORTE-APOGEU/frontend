// Caminho: src/components/ui/FormInput.tsx
import React from "react";
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  Platform,
} from "react-native";

interface Props extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  children?: React.ReactNode;
}

export function FormInput({
  value,
  onChangeText,
  placeholder,
  children,
  ...rest
}: Props) {
  return (
    <View
      className="w-full h-12 bg-white/75 border-b-[1.2px] border-[#358838] rounded-lg px-4 flex-row items-center justify-between"
      style={styles.shadow}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#212121"
        className="flex-1 text-black"
        {...rest}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shadow:
    Platform.OS === "ios"
      ? {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
        }
      : { elevation: 3 },
});
