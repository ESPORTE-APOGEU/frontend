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
  multiSelect?: boolean;
  selectedItems?: string[]; // Para seleção múltipla
}

const DropDownInput: React.FC<Props> = ({
  label,
  selectedValue,
  onValueChange,
  options,
  awaitOptions,
  placeholder,
  mode = 'dialog',
  multiSelect = false,
  selectedItems = [],
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
  // No modo multiSelect, sempre força o Picker para o placeholder
  const [pickerKey, setPickerKey] = React.useState<number>(0);
  const pickerValue = multiSelect ? '' : selectedValue;

  const handleValueChange = (itemValue: string, itemIndex: number) => {
    if (multiSelect) {
      if (itemValue !== '') {
        onValueChange(itemValue, itemIndex);
        setPickerKey(prev => prev + 1); // força re-render
      }
    } else {
      onValueChange(itemValue, itemIndex);
    }
  };

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
              key={multiSelect ? pickerKey : 'single'}
              selectedValue={pickerValue}
              onValueChange={handleValueChange}
              mode={mode}
              dropdownIconColor="#047857"
              style={{
                backgroundColor: 'rgba(244, 244, 245, 0.95)',
                borderRadius: 12,
              }}
            >
              <Picker.Item
                label={placeholder || 'Selecione'}
                value=""
                enabled={false}
                color="#9ca3af"
              />
              {(multiSelect
                ? optionsList.filter(opt => !selectedItems.includes(opt.value))
                : optionsList
              ).map((option) => (
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
