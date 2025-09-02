// src/screens/EditProfileScreen.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export default function EditProfileScreen({ navigation }: any) {
  const [name, setName] = useState("Stefane Brito");
  const [city, setCity] = useState("Itumbiara, Goiás");
  const [role, setRole] = useState("Designer");

  function onBack() {
    if (navigation && navigation.goBack) navigation.goBack();
  }

  function onEditPhoto() {}

  function onSave() {}

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="chevron-left" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar perfil</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarBox}>
          <Image
            source={require("../assets/images/Ellipse 27.png")}
            style={styles.avatar}
          />
          <TouchableOpacity onPress={onEditPhoto} style={styles.editPhotoBtn}>
            <Text style={styles.editPhotoText}>Editar foto</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor="rgba(0,0,0,0.35)"
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Cidade</Text>
          <TextInput
            value={city}
            onChangeText={setCity}
            style={styles.input}
            placeholder="Sua cidade"
            placeholderTextColor="rgba(0,0,0,0.35)"
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Profissão</Text>
          <TextInput
            value={role}
            onChangeText={setRole}
            style={styles.input}
            placeholder="Sua profissão"
            placeholderTextColor="rgba(0,0,0,0.35)"
          />
        </View>
        <View style={styles.separator} />

        <View style={{ height: 160 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const LABEL_WIDTH = 110;
const TOP_SPACING =
  Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FFED", paddingTop: TOP_SPACING },
  header: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  backBtn: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    color: "#000",
  },
  headerRight: { width: 48, height: 48 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  avatarBox: { alignItems: "center", marginTop: 8, marginBottom: 24 },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#D9D9D9",
  },
  editPhotoBtn: { marginTop: 12 },
  editPhotoText: { fontSize: 18, color: "#10CF65" },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
  },
  label: {
    width: LABEL_WIDTH,
    fontSize: 18,
    color: "rgba(0,0,0,0.5)",
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "#000",
    paddingVertical: 8,
  },
  separator: {
    height: 0.5,
    backgroundColor: "rgba(0,0,0,0.5)",
    marginLeft: LABEL_WIDTH,
    marginTop: -10,
    marginBottom: 0,
  },
  footer: {
    
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 28,
    paddingHorizontal: 16,
  },
  saveBtn: {
    height: 40,
    borderRadius: 12,
    backgroundColor: "#10CF65",
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { fontSize: 18, color: "#FFF", fontWeight: "600" },
});
