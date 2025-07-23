import React from "react";
import {
  View,
  Text,
  TextInput as RNTextInput,
  TextInputProps,
} from "react-native";

interface Props extends TextInputProps {
  label: string;
  placeholder?: string;
}

const TextInput: React.FC<Props> = ({
  label,
  className,
  placeholder,
  ...props
}) => (
  <View className="mb-4 w-full items-center font-[Poppins-Regular]">
    <View className="w-[80%]">
      <Text className="font-[Poppins-Bold] mb-0.5" accessibilityLabel={label}>
        {label}
      </Text>
      <View className="border-b border-green-700">
        <RNTextInput
          placeholder={placeholder}
          className={`h-10 bg-neutral-100/75 rounded-lg border-gray-100 ${
            className ?? ""
          }`}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 6 }, // direita e baixo
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 12, // pro Android
          }}
          {...props}
        />
      </View>
    </View>
  </View>
);

export default TextInput;
