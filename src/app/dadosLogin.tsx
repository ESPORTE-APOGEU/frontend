// src/screens/EditProfileScreen.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";

export default function EditProfileScreen({ navigation }: any) {
  const [email, setEmail] = useState("diogolael@gmail.com");
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function onBack() {
    if (navigation && navigation.goBack) navigation.goBack();
  }

  function onSave() {}

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="chevron-left" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dados de login</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Informações</Text>

          {/* Email com label dentro do campo */}
          <View style={styles.outlinedField}>
            <Text style={styles.inlineLabel}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.rightValueInput}
              placeholder=""
              placeholderTextColor="rgba(0,0,0,0.62)"
            />
          </View>

          {/* Alterar senha com label dentro do campo */}
          <TouchableOpacity
            style={[styles.outlinedField, { marginTop: 16 }]}
            activeOpacity={0.8}
            onPress={() => setShowPasswordFields((v) => !v)}>
            <Text style={styles.inlineLabel}>Alterar senha</Text>
            <Feather
              name={showPasswordFields ? "chevron-up" : "chevron-down"}
              size={20}
              color="#358838"
            />
          </TouchableOpacity>

          {showPasswordFields && (
            <View style={{ marginTop: 24 }}>
              {/* Campos com label fora */}
              <Text style={styles.fieldLabel}>Senha atual</Text>
              <View style={styles.underlineField}>
                <TextInput
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showCurrent}
                  style={styles.underlineInputText}
                  placeholder="Digite a senha atual"
                  placeholderTextColor="#697077"
                />
              </View>

              <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
                Senha nova
              </Text>
              <View style={styles.underlineField}>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNew}
                  style={styles.underlineInputText}
                  placeholder="Digite a nova senha"
                  placeholderTextColor="#697077"
                />
              </View>

              <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
                Confirme a senha nova
              </Text>
              <View style={styles.underlineField}>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  style={styles.underlineInputText}
                  placeholder="Confirme a nova senha"
                  placeholderTextColor="#697077"
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
          <Text style={styles.saveText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
    paddingBottom: 120,
  },
  infoCard: {
    backgroundColor: "rgba(247,247,247,0.75)",
    borderBottomWidth: 2,
    borderBottomColor: "#43A047",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 2, height: 2 },
    elevation: 3,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#000",
    fontWeight: "300",
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#21272A",
    marginBottom: 8,
  },
  outlinedField: {
    height: 41,
    borderWidth: 0.6,
    borderColor: "rgba(0,0,0,0.67)",
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inlineLabel: {
    fontSize: 13,
    color: "rgba(0,0,0,0.62)",
  },
  rightValueInput: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    color: "rgba(0,0,0,0.62)",
  },
  underlineField: {
    height: 39,
    backgroundColor: "rgba(253,255,249,0.75)",
    borderBottomWidth: 1,
    borderBottomColor: "#43A047",
    borderRadius: 5,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 2, height: 2 },
    elevation: 2,
  },
  underlineInputText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingRight: 32,
  },
  eyeBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 16,
    paddingHorizontal: 16,
  },
  saveBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#43A047",
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { fontSize: 20, color: "#FFF", fontWeight: "600" },
});
