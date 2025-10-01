// components/profile/SportsPickerModal.tsx
import React, { useMemo, useState } from "react";
import {
  Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (sport: string) => void;
  selected?: string[];   // já escolhidos (para desabilitar)
  // opcional: lista vinda do backend; se não vier, usa fallback
  availableSports?: string[];
};

const FALLBACK_SPORTS = [
  "Futebol", "Basquete", "Vôlei", "Corrida", "Ciclismo",
  "Natação", "Tênis", "Yoga", "Crossfit", "Skate"
];

export default function SportsPickerModal({
  visible, onClose, onSelect, selected = [], availableSports
}: Props) {
  const [q, setQ] = useState("");

  const data = useMemo(() => {
    const base = (availableSports && availableSports.length > 0)
      ? availableSports
      : FALLBACK_SPORTS;
    const normalized = q.trim().toLowerCase();
    return normalized
      ? base.filter(s => s.toLowerCase().includes(normalized))
      : base;
  }, [q, availableSports]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Escolha um esporte</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>Fechar</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Buscar esporte…"
            value={q}
            onChangeText={setQ}
            style={styles.search}
            placeholderTextColor="#7A7676"
          />

          <FlatList
            data={data}
            keyExtractor={(s) => s}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={({ item }) => {
              const disabled = selected.includes(item);
              return (
                <TouchableOpacity
                  onPress={() => !disabled && onSelect(item)}
                  disabled={disabled}
                  style={[styles.item, disabled && styles.itemDisabled]}
                >
                  <Text style={styles.itemText}>{item}</Text>
                  {disabled && <Text style={styles.itemTag}>Selecionado</Text>}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "flex-end"
  },
  sheet: {
    backgroundColor: "#FFF", borderTopLeftRadius: 16, borderTopRightRadius: 16,
    padding: 16, maxHeight: "75%"
  },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8
  },
  title: { fontSize: 18, fontWeight: "600", color: "#000" },
  close: { color: "#43A047", fontSize: 14, fontWeight: "600" },
  search: {
    borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    color: "#000", marginBottom: 12
  },
  item: {
    backgroundColor: "#F7FFED", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between"
  },
  itemDisabled: { opacity: 0.5 },
  itemText: { color: "#000", fontSize: 16, fontWeight: "500" },
  itemTag: { color: "#43A047", fontSize: 12, fontWeight: "600" },
});
