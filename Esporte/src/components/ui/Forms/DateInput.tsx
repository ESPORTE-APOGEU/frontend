import React from "react";
import {
  View,
  Text,
  Pressable,
  Platform,
  Modal,
  TouchableOpacity,
} from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
  type AndroidNativeProps,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  value?: Date | null;
  onChange?: (date: Date) => void;
  label?: string;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
};

const GREEN = "#10CF65";
const GREEN_DARK = "#358838";

export default function DateInput({
  value,
  onChange,
  label = "Data de Nascimento",
  placeholder = "Selecione sua data de nascimento",
  maximumDate,
  minimumDate,
}: Props) {
  const [iosOpen, setIosOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date>(value || new Date());

  React.useEffect(() => {
    if (value) setTempDate(value);
  }, [value]);

  const fmtPT = (d: Date) =>
    new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);

  const showAndroid = () => {
    DateTimePickerAndroid.open({
      mode: "date",
      value: value || new Date(2000, 0, 1),
      is24Hour: true,
      maximumDate,
      minimumDate,
      onChange: (_event, selected) => {
        if (selected) onChange?.(selected);
      },
    } as AndroidNativeProps);
  };

  const openPicker = () => {
    if (Platform.OS === "android") {
      showAndroid();
    } else {
      setIosOpen(true);
    }
  };

  const confirmIOS = () => {
    onChange?.(tempDate);
    setIosOpen(false);
  };

  const cancelIOS = () => {
    setTempDate(value || new Date());
    setIosOpen(false);
  };

  const shownText = value ? fmtPT(value) : placeholder;

  return (
    <View className="mb-4 w-full items-center">
      <View className="w-[80%]">
        {!!label && (
          <Text className="text-[16px] leading-6 text-[rgba(41,45,50,0.88)] mb-1">
            {label}
          </Text>
        )}

        {/* Caixa no padrão do Figma (42px, bg translúcido, borda inferior verde, radius 8) */}
        <Pressable
          onPress={openPicker}
          className="h-[42px] bg-[rgba(253,255,249,0.41)] rounded-lg border-b border-[#358838] px-3 flex-row items-center"
          accessibilityRole="button"
          accessibilityLabel={label}
        >
          <Text
            className={
              value
                ? "text-[15px] leading-[18px] text-black"
                : "text-[15px] leading-[18px] text-[rgba(0,0,0,0.41)]"
            }
            numberOfLines={1}
          >
            {shownText}
          </Text>
          <View className="ml-auto">
            <Ionicons name="calendar" size={18} color="#626262" />
          </View>
        </Pressable>

        {/* iOS: Modal com spinner, sem “componente extra” na tela */}
        <Modal
          visible={iosOpen}
          transparent
          animationType="fade"
          onRequestClose={cancelIOS}
        >
          <Pressable className="flex-1 bg-black/40" onPress={cancelIOS}>
            <View className="mt-auto bg-white rounded-t-2xl p-4">
              <Text className="text-base font-semibold mb-2">
                Selecione a data
              </Text>

              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(_e, d) => d && setTempDate(d)}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                // iOS: cor dos realces
                themeVariant="light"
                accentColor={GREEN_DARK as any}
              />

              <View className="flex-row justify-end mt-2">
                <TouchableOpacity onPress={cancelIOS} className="px-4 py-3">
                  <Text className="text-gray-500">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmIOS} className="px-4 py-3">
                  <Text className="text-[#{GREEN_DARK}] text-[#358838] font-semibold">
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
      </View>
    </View>
  );
}
