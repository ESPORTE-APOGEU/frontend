import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import DropDownPicker, { ItemType } from "react-native-dropdown-picker";

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  selectedValue: string; // usado no modo single
  onValueChange: (itemValue: string, itemIndex: number) => void;
  options?: Option[];
  awaitOptions?: () => Promise<Option[]>;
  placeholder?: string;
  className?: string;

  // Não é usado por DropDownPicker; mantido por compat com sua API antiga
  mode?: "dialog" | "dropdown";

  // Multi
  multiSelect?: boolean;
  selectedItems?: string[]; // valores no multi
  onChangeItems?: (values: string[]) => void; // opcional: controle externo do multi
}

const DropDownInput: React.FC<Props> = ({
  label,
  selectedValue,
  onValueChange,
  options,
  awaitOptions,
  placeholder,
  multiSelect = false,
  selectedItems = [],
  onChangeItems,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const [optionsList, setOptionsList] = React.useState<Option[]>(options || []);

  // Estado exigido pela lib
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<ItemType<string>[]>([]);

  // Valor controlado (string no single, string[] no multi)
  const value = multiSelect ? selectedItems : selectedValue;

  // Carrega opções (assíncrono opcional)
  React.useEffect(() => {
    if (awaitOptions && !hasLoaded && !isLoading) {
      setIsLoading(true);
      awaitOptions()
        .then((data) => {
          setOptionsList(data || []);
          setHasLoaded(true);
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [awaitOptions, hasLoaded, isLoading]);

  // Sincroniza items da lib quando optionsList muda
  React.useEffect(() => {
    setItems(optionsList.map((o) => ({ label: o.label, value: o.value })));
  }, [optionsList]);

  // setValue exigido pela lib — adapta pra sua API
  const setValue = React.useCallback(
    (updater: any) => {
      if (multiSelect) {
        // updater recebe (prev: string[]) => string[]   ou   string[]
        const nextArr: string[] =
          typeof updater === "function" ? updater(selectedItems) : updater;
        // callback externo opcional para multi-controlado
        onChangeItems?.(nextArr);

        // fallback: se só tiver onValueChange (API antiga), dispare com o último item quando presente
        if (!onChangeItems) {
          const last = nextArr[nextArr.length - 1];
          const idx = optionsList.findIndex((o) => o.value === last);
          if (last != null) onValueChange(last, idx >= 0 ? idx : -1);
        }
      } else {
        // updater recebe (prev: string) => string   ou   string
        const nextVal: string =
          typeof updater === "function" ? updater(selectedValue) : updater;
        const idx = optionsList.findIndex((o) => o.value === nextVal);
        onValueChange(nextVal, idx >= 0 ? idx : -1);
      }
    },
    [
      multiSelect,
      selectedItems,
      selectedValue,
      onValueChange,
      onChangeItems,
      optionsList,
    ]
  );

  return (
    <View className="mb-4 w-full items-center">
      <View className="w-[80%]">
        <Text
          className="text-[16px] leading-6 text-[rgba(41,45,50,0.88)] mb-1"
          accessibilityLabel={label}
        >
          {label}
        </Text>

        {isLoading ? (
          <ActivityIndicator size="small" color="#358838" />
        ) : (
          <DropDownPicker
            open={open}
            setOpen={setOpen}
            // valor controlado (string | string[])
            value={value as any}
            setValue={setValue}
            items={items}
            setItems={setItems}
            multiple={multiSelect}
            placeholder={
              placeholder ||
              (multiSelect ? "Selecione um ou mais" : "Selecione")
            }
            // Estilo para bater com o seu Figma (42px, bg translúcido, borda inferior verde, radius 8)
            style={{
              height: 42,
              backgroundColor: "rgba(253,255,249,0.41)",
              borderWidth: 0,
              borderBottomWidth: 1,
              borderColor: "#358838",
              borderRadius: 8,
            }}
            dropDownContainerStyle={{
              borderColor: "#e5e7eb",
            }}
            listMode="SCROLLVIEW"
            zIndex={1000}
          />
        )}
      </View>
    </View>
  );
};

export default DropDownInput;
