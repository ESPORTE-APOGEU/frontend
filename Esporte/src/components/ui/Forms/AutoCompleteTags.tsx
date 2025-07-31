import React from 'react';
import { View , Text, TouchableOpacity} from "react-native";
import TextInput from './TextInput';

interface AutoCompleteTagsProps { 
  options?: { label: string; value: string }[];
  awaitOptions?: () => Promise<{ label: string; value: string }[]>;
  onSelect?: (value: string) => void;
  onRemove?: () => void;
  label: string;
  placeholder: string;
  multiSelect?: boolean; // Nova prop para controlar seleção múltipla
  selectedValue?: string; // Para seleção única
}

export default function AutoCompleteTags({
  options = [],
  awaitOptions,
  onSelect,
  onRemove,
  label,
  placeholder,
  multiSelect = false,
  selectedValue,
}: AutoCompleteTagsProps) {
  const[optionsList, setOptionsList] = React.useState<{ label: string; value: string }[]>(options);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
  const [viewSuggestions, setViewSuggestions] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = React.useState<boolean>(false);
  
  // Use uma referência única para cada função awaitOptions
  const awaitOptionsRef = React.useRef(awaitOptions);

  React.useEffect(() => {
    // Resetar estado se a função awaitOptions mudou
    if (awaitOptionsRef.current !== awaitOptions) {
      awaitOptionsRef.current = awaitOptions;
      setHasLoaded(false);
      setOptionsList(options);
    }
  }, [awaitOptions, options]);

  React.useEffect(() => {
    // Só carrega se tem awaitOptions e ainda não carregou
    if (awaitOptions && !hasLoaded && !isLoading) {
      console.log(`AutoComplete (${label}): Carregando opções...`);
      setIsLoading(true);
      awaitOptions()
        .then((data) => {
          console.log(`AutoComplete (${label}): Opções carregadas:`, data.length, "itens");
          setOptionsList(data);
          setHasLoaded(true);
        })
        .catch((error) => {
          console.error(`AutoComplete (${label}): Erro ao carregar opções:`, error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [awaitOptions, hasLoaded, isLoading, label]);

  const handleSearch = React.useCallback((query: string) => {
    console.log(`AutoComplete (${label}): Pesquisando por:`, query);
    setInputValue(query);
    if (query.trim()) {
      const usedValues = multiSelect ? selectedValues : (selectedValue ? [selectedValue] : []);
      const filteredSuggestions = optionsList
        .filter(option => 
          option.label.toLowerCase().includes(query.toLowerCase()) &&
          !usedValues.includes(option.value)
        )
        .sort((a, b) => {
          const aIndex = a.label.toLowerCase().indexOf(query.toLowerCase());
          const bIndex = b.label.toLowerCase().indexOf(query.toLowerCase());
          return aIndex - bIndex;
        })
        .slice(0, 5) // Mostrar 5 sugestões
        .map(option => option.label);
      console.log(`AutoComplete (${label}): Sugestões filtradas:`, filteredSuggestions);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [optionsList, selectedValues, multiSelect, selectedValue, label]);

  const handleSelectSuggestion = (suggestion: string) => {
    const selectedOption = optionsList.find(option => option.label === suggestion);
    if (selectedOption) {
      if (multiSelect) {
        if (!selectedValues.includes(selectedOption.value)) {
          const newSelectedValues = [...selectedValues, selectedOption.value];
          setSelectedValues(newSelectedValues);
        }
      }
      
      if (onSelect) {
        onSelect(selectedOption.value);
      }
      setInputValue('');
      setSuggestions([]);
      setViewSuggestions(false);
    }
  };

  const removeSelectedValue = (valueToRemove: string) => {
    if (multiSelect) {
      setSelectedValues(prev => prev.filter(value => value !== valueToRemove));
    }
    if (onRemove) {
      onRemove();
    }
  };

  // Para seleção única, verificar se há valor selecionado
  const hasSelection = multiSelect ? selectedValues.length > 0 : !!selectedValue;
  const currentSelectedLabel = selectedValue ? optionsList.find(opt => opt.value === selectedValue)?.label : null;
  return (
    <View>
      {/* Para seleção única - mostrar tag ou input */}
      {!multiSelect && selectedValue ? (
        <View className="mb-4 w-full items-center">
          <View className="w-[80%]">
            <Text className="font-[Poppins-Bold] mb-2" accessibilityLabel={label}>
              {label}
            </Text>
            <View className="border-b border-[#40B843] " 
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 4, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
                elevation: 12,
            }}>
              <View className="bg-white/95 rounded-lg px-4 py-2 flex-row items-center justify-between">
                <Text className="text-gray-500  text-sm flex-1">{currentSelectedLabel || selectedValue}</Text>
                <TouchableOpacity 
                  onPress={() => removeSelectedValue(selectedValue)}
                  className="w-8 h-8 items-center justify-center ml-2"
                  style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text className="text-[#40B843] text-3xl font-bold">×</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <>
          {/* Tags selecionadas para seleção múltipla */}
          {multiSelect && selectedValues.length > 0 && (
            <View className="mb-2 w-full items-center">
              <View className="w-[80%]">
                <Text className="font-[Poppins-Bold] mb-2 text-sm">Selecionados:</Text>
                <View className="flex-row flex-wrap">
                  {selectedValues.map((value) => {
                    const option = optionsList.find(opt => opt.value === value);
                    return (
                      <View key={value} className="bg-green-100 border border-green-300 rounded-full px-3 py-1 mr-2 mb-2 flex-row items-center">
                        <Text className="text-green-800 text-sm">{option?.label || value}</Text>
                        <TouchableOpacity 
                          onPress={() => removeSelectedValue(value)}
                          className="ml-2"
                        >
                          <Text className="text-green-600 font-bold">×</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>
          )}
          
          <TextInput
            label={label}
            placeholder={isLoading ? "Carregando..." : placeholder}
            value={inputValue}
            onFocus={() => setViewSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setViewSuggestions(false), 150);
            }}
            onChangeText={handleSearch}
            editable={!isLoading}
          />
          
          {viewSuggestions && suggestions.length > 0 && (
            <View className="w-full items-center">
              <View className="w-[80%] bg-white border border-gray-200 rounded-lg shadow-md mt-1">
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelectSuggestion(suggestion)}
                    className="p-3 border-b border-gray-100"
                    activeOpacity={0.7}
                  >
                    <Text className="text-gray-800">{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

