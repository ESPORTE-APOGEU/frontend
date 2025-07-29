import React, { useState } from 'react';
import { View, Text, TextInput as RNTextInput, TouchableOpacity } from 'react-native';

interface Props {
  label: string;
  className?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
  password?: boolean;
  [key: string]: any;
}

const TextInput: React.FC<Props> = ({ 
  label, 
  className, 
  placeholder, 
  onChangeText, 
  value, 
  password, 
  ...props 
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const { secureTextEntry: _, ...otherProps } = props;
  

  return (
    <View className="mb-4 w-full items-center font-[Poppins-Regular]">
      <View className="w-[80%]">
        <Text className="font-[Poppins-Bold] mb-0.5 font-bold" accessibilityLabel={label}>
          {label}
        </Text>
        <View className="border-b border-green-700 relative"
        style={{
              shadowColor: '#000',
              shadowOffset: { width: 4, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 12,
            }}>
          <RNTextInput
            placeholder={placeholder}
            className={`h-10 bg-neutral-100/95 rounded-lg border-gray-100 px-3 ${password ? 'pr-12' : ''} ${className ?? ''}`}
            onChangeText={onChangeText}
            value={value}
            secureTextEntry={password && !isPasswordVisible}
            {...props}
          />
          {password && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-3 top-2.5"
              accessibilityLabel={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
            >
              <Text className="text-gray-500 text-lg">
                {isPasswordVisible ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default TextInput;
