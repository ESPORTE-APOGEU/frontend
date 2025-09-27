import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Pressable,
} from "react-native";
import TextInput from "./TextInput";

type Option = { label: string; value: string };

type Props = {
  label: string;
  placeholder: string;
  value?: string | null; // valor selecionado (value)
  onSelect?: (value: string) => void; // dispara ao escolher
  onClear?: () => void; // limpar seleção
  options?: Option[];
  awaitOptions?: () => Promise<Option[]>;
};

const BOX =
  "h-[42px] bg-[rgba(253,255,249,0.41)] rounded-lg border-b border-[#358838] px-3 flex-row items-center";
const LABEL = "text-[16px] leading-6 text-[rgba(41,45,50,0.88)] mb-1";
const PH = "text-[15px] leading-[18px] text-[rgba(0,0,0,0.41)]";
const TXT = "text-[15px] leading-[18px] text-black";

export default function AutoComplete({
  label,
  placeholder,
  value,
  onSelect,
  onClear,
  options = [],
  awaitOptions,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [optionsList, setOptionsList] = React.useState<Option[]>(options);
  const [input, setInput] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<Option[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  // carrega opções async 1x por função
  const fnRef = React.useRef(awaitOptions);
  React.useEffect(() => {
    if (fnRef.current !== awaitOptions) {
      fnRef.current = awaitOptions;
      setLoaded(false);
      setOptionsList(options);
    }
  }, [awaitOptions, options]);

  React.useEffect(() => {
    if (awaitOptions && !loaded && !isLoading) {
      setIsLoading(true);
      awaitOptions()
        .then((data) => setOptionsList(data || []))
        .finally(() => {
          setLoaded(true);
          setIsLoading(false);
        });
    }
  }, [awaitOptions, loaded, isLoading]);

  const compute = React.useCallback(
    (q: string) => {
      const lc = q.trim().toLowerCase();
      if (!lc) return [];
      return optionsList
        .filter((o) => o.label.toLowerCase().includes(lc))
        .sort((a, b) => {
          const ai = a.label.toLowerCase().indexOf(lc);
          const bi = b.label.toLowerCase().indexOf(lc);
          return ai - bi;
        })
        .slice(0, 20);
    },
    [optionsList]
  );

  const openModal = () => {
    setInput("");
    setSuggestions([]);
    setOpen(true);
  };

  const choose = (opt: Option) => {
    onSelect?.(opt.value);
    setOpen(false);
  };

  const clear = () => {
    onClear?.();
  };

  const selectedLabel =
    value && optionsList.find((o) => o.value === value)?.label;

  return (
    <View>
      {/* Caixa “fechada” (igual aos outros inputs) */}
      <View className="mb-4 w-full items-center">
        <View className="w-[80%]">
          <Text className={LABEL}>{label}</Text>

          <Pressable onPress={openModal} className={BOX}>
            <Text className={value ? TXT : PH} numberOfLines={1}>
              {selectedLabel ||
                value ||
                (isLoading ? "Carregando..." : placeholder)}
            </Text>

            {value ? (
              <TouchableOpacity onPress={clear} className="ml-auto pl-3 py-2">
                <Text className="text-[#358838] text-lg">×</Text>
              </TouchableOpacity>
            ) : (
              <Text className="ml-auto text-[#626262]">▼</Text>
            )}
          </Pressable>
        </View>
      </View>

      {/* Modal com busca e sugestões (igual nos dois SOs) */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          {/* backdrop */}
          <Pressable
            className="flex-1 bg-black/40"
            onPress={() => setOpen(false)}
          />

          {/* bottom-sheet */}
          <View className="bg-white rounded-t-2xl p-4 max-h-[70%]">
            <TextInput
              label={label}
              placeholder={isLoading ? "Carregando..." : "Digite para buscar"}
              value={input}
              onChangeText={(t) => {
                setInput(t);
                setSuggestions(compute(t));
              }}
              autoFocus
            />

            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.value}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 16 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => choose(item)}
                  className="py-3 px-2 border-b border-gray-100"
                  activeOpacity={0.7}
                >
                  <Text className="text-gray-800">{item.label}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text className="text-gray-500 px-2 py-3">
                  {input ? "Nenhum resultado." : "Digite para buscar..."}
                </Text>
              }
            />

            <TouchableOpacity
              onPress={() => setOpen(false)}
              className="mt-2 py-3 items-center"
            >
              <Text className="text-gray-500">Fechar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
