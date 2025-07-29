import React from 'react';
import { View, Text , ActivityIndicator} from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  selectedValue: string;
  onValueChange: (itemValue: string, itemIndex: number) => void;
  options?: Option[];
  awaitOptions?: () => Promise<Option[]>;
  placeholder?: string;
  className?: string;
  mode?: 'dialog' | 'dropdown'; 
}

const DropDownInput: React.FC<Props> = ({
  label,
  selectedValue,
  onValueChange,
  options,
  awaitOptions,
  placeholder,
  mode = 'dialog',
}) => {

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = React.useState<boolean>(false);
  const [optionsList, setOptionsList] = React.useState<Option[]>(options || []);
  const awaitOptionsRef = React.useRef(awaitOptions);
  React.useEffect(() => {
    if (awaitOptions && !hasLoaded && !isLoading) {
      console.log(`DropDownInput (${label}): Carregando opções...`);
      setIsLoading(true);
      awaitOptions()
        .then((data) => {
          console.log(`DropDownInput (${label}): Opções carregadas:`, data.length, "itens");
          setOptionsList(data);
          setHasLoaded(true);
        })
        .catch((error) => {
          console.error(`DropDownInput (${label}): Erro ao carregar opções:`, error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [awaitOptions, hasLoaded, isLoading, label]);
  return (
    <View className="mb-4 w-full items-center font-[Poppins-Regular]">
          <View className="w-[80%]">
            <Text className="font-[Poppins-Bold] mb-0.5 font-bold" accessibilityLabel={label}>
              {label}
            </Text>
          {isLoading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
        <View className="border-b border-green-700 relative"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 4, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 12,
              }}>
            <Picker
              selectedValue={selectedValue}
              onValueChange={onValueChange}
              mode={mode} 
              dropdownIconColor="#047857"
              // Picker não suporta className e NativeWind
              style={{
                backgroundColor: 'rgba(244, 244, 245, 0.95)',
                borderRadius: 12,

              }}
            >
              {placeholder && (
                <Picker.Item
                  label={placeholder}
                  value=""
                  enabled={false}
                  color="#9ca3af"
                />
              )}

              {optionsList.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
          )}
          </View>
      </View>
  );
};

export default DropDownInput;
