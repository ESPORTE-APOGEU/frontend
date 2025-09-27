// src/screens/EditLoginDataScreen.tsx
import React, { useMemo, useState } from "react";
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
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";

export default function EditLoginDataScreen({ navigation }: any) {
  const { isLoaded, isSignedIn, user } = useUser();

  const email = useMemo(
    () => user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? "",
    [user]
  );

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);

  function onBack() {
    navigation?.goBack?.();
  }

  async function onSave() {
    try {
      if (!isLoaded || !isSignedIn || !user) {
        Alert.alert("Sessão", "Você precisa estar logado.");
        return;
      }

      if (!showPasswordFields) {
        Alert.alert("Nada para salvar", "Ative 'Alterar senha' para definir uma nova senha.");
        return;
      }

      if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
        Alert.alert("Campos obrigatórios", "Preencha todas as senhas.");
        return;
      }

      if (newPassword.length < 8) {
        Alert.alert("Senha fraca", "A nova senha precisa ter pelo menos 8 caracteres.");
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert("Confirmação", "A confirmação não confere com a nova senha.");
        return;
      }

      setSaving(true);

      // Clerk valida a senha atual. Se estiver errada, lança erro.
      await user.updatePassword({
        currentPassword,
        newPassword,
        signOutOfOtherSessions: true, // opcional: desconecta sessões antigas
      });

      // limpeza e feedback
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordFields(false);

      Alert.alert("Tudo certo!", "Sua senha foi alterada com sucesso.", [
        { text: "OK", onPress: onBack },
      ]);
    } catch (err: any) {
      // Mensagens mais amigáveis para alguns erros comuns do Clerk
      const msg =
        err?.errors?.[0]?.message ||
        err?.message ||
        "Não foi possível alterar a senha. Verifique a senha atual e tente novamente.";
      Alert.alert("Erro", msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Feather name="chevron-left" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dados de login</Text>
        <View style={styles.headerRight} />
      </View>

      {!isLoaded ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Informações</Text>

              {/* Email (somente leitura) */}
              <View style={styles.outlinedField}>
                <Text style={styles.inlineLabel}>Email</Text>
                <TextInput
                  value={email}
                  editable={false}
                  style={[styles.rightValueInput, { color: "rgba(0,0,0,0.62)" }]}
                />
              </View>

              {/* Abrir/fechar campos de senha */}
              <TouchableOpacity
                style={[styles.outlinedField, { marginTop: 16 }]}
                activeOpacity={0.8}
                onPress={() => setShowPasswordFields((v) => !v)}
              >
                <Text style={styles.inlineLabel}>Alterar senha</Text>
                <Feather
                  name={showPasswordFields ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#358838"
                />
              </TouchableOpacity>

              {showPasswordFields && (
                <View style={{ marginTop: 24 }}>
                  {/* Senha atual */}
                  <Text style={styles.fieldLabel}>Senha atual</Text>
                  <View style={styles.underlineField}>
                    <TextInput
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      secureTextEntry={!showCurrent}
                      style={styles.underlineInputText}
                      placeholder="Digite a senha atual"
                      placeholderTextColor="#697077"
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowCurrent((v) => !v)} style={styles.eyeBtn}>
                      <Feather name={showCurrent ? "eye" : "eye-off"} size={18} color="#697077" />
                    </TouchableOpacity>
                  </View>

                  {/* Senha nova */}
                  <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Senha nova</Text>
                  <View style={styles.underlineField}>
                    <TextInput
                      value={newPassword}
                      onChangeText={setNewPassword}
                      secureTextEntry={!showNew}
                      style={styles.underlineInputText}
                      placeholder="Digite a nova senha"
                      placeholderTextColor="#697077"
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowNew((v) => !v)} style={styles.eyeBtn}>
                      <Feather name={showNew ? "eye" : "eye-off"} size={18} color="#697077" />
                    </TouchableOpacity>
                  </View>

                  {/* Confirmar senha nova */}
                  <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Confirme a senha nova</Text>
                  <View style={styles.underlineField}>
                    <TextInput
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirm}
                      style={styles.underlineInputText}
                      placeholder="Confirme a nova senha"
                      placeholderTextColor="#697077"
                      autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={() => setShowConfirm((v) => !v)} style={styles.eyeBtn}>
                      <Feather name={showConfirm ? "eye" : "eye-off"} size={18} color="#697077" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.saveBtn, { opacity: saving ? 0.6 : 1 }]}
              onPress={onSave}
              disabled={saving}
            >
              <Text style={styles.saveText}>{saving ? "Salvando..." : "Salvar"}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const TOP_SPACING = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FFED", paddingTop: TOP_SPACING },
  header: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  backBtn: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 24, color: "#000" },
  headerRight: { width: 48, height: 48 },
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 120 },
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
  sectionTitle: { fontSize: 20, color: "#000", fontWeight: "300", marginBottom: 12 },
  fieldLabel: { fontSize: 14, color: "#21272A", marginBottom: 8 },
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
  inlineLabel: { fontSize: 13, color: "rgba(0,0,0,0.62)" },
  rightValueInput: { flex: 1, textAlign: "right", fontSize: 13, color: "#000" },
  underlineField: {
    height: 39,
    backgroundColor: "rgba(253,255,249,0.75)",
    borderBottomWidth: 1,
    borderBottomColor: "#43A047",
    borderRadius: 5,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  underlineInputText: { flex: 1, fontSize: 16, color: "#000", paddingRight: 8 },
  eyeBtn: { width: 28, height: 28, alignItems: "center", justifyContent: "center" },
  footer: { position: "absolute", left: 0, right: 0, bottom: 16, paddingHorizontal: 16 },
  saveBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#43A047",
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { fontSize: 20, color: "#FFF", fontWeight: "600" },
});
