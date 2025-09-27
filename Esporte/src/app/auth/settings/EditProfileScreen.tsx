// src/screens/EditProfileScreen.tsx
import React, { useEffect, useState } from "react";
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
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@clerk/clerk-expo";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

type UserResponse = {
  id: string;
  name: string;
  email: string;
  birthday?: string | null;
  gender?: string | null;
  city?: string | null;
  sports?: string[];
  photo?: string | null;
};

export default function EditProfileScreen({ navigation }: any) {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // campos
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState("Designer"); // ainda não existe no backend (mantemos local por enquanto)
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // foto local escolhida (antes de subir)
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  // dados atuais completos (para preservar campos que a tela não edita)
  const [current, setCurrent] = useState<UserResponse | null>(null);

  function onBack() {
    if (navigation?.goBack) navigation.goBack();
  }

  // ————— Carrega perfil —————
useEffect(() => {
  (async () => {
    // se ainda não carregou o Clerk, não busca (mas tb não liga o loading)
    if (!isLoaded) return;

    if (!isSignedIn) {
      setLoading(false);   // 👈 garante que o spinner apague
      return;
    }

    if (!BACKEND_URL) {
      Alert.alert("Configuração", "EXPO_PUBLIC_BACKEND_URL não definida.");
      setLoading(false);   // 👈 apaga o spinner neste early-return
      return;
    }

    try {
      setLoading(true);    // 👈 só liga aqui, quando vai mesmo buscar
      const jwt =
        (await getToken({ template: "backend", skipCache: true })) ||
        (await getToken({ template: "backend" }));

      const res = await fetch(`${BACKEND_URL}/api/v1/users/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      if (res.status === 401) {
        Alert.alert("Sessão", "Sessão expirada.");
        return;            // finally vai rodar e desligar o loading
      }
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Falha ao carregar perfil (${res.status}): ${txt}`);
      }

      const data: UserResponse = await res.json();
      setCurrent(data);
      setName(data.name || "");
      setEmail(data.email || "");
      setCity(data.city || "");
      setPhotoUrl(data.photo || null);
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível carregar o perfil.");
    } finally {
      setLoading(false);   // 👈 sempre desliga
    }
  })();
  // ⚠️ Remova `getToken` daqui para não re-disparar efeito desnecessariamente
}, [isLoaded, isSignedIn]);

  // ————— Escolhe foto e faz preview —————
  async function onEditPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão", "Precisamos do acesso às fotos.");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: [1, 1], // avatar quadrado
    });
    if (!res.canceled && res.assets?.length) {
      const uri = res.assets[0].uri;
      setLocalImageUri(uri);
      // mostra preview imediatamente
      setPhotoUrl(uri);
    }
  }

  // ————— Pede assinatura e sobe foto no Cloudinary —————
  async function uploadToCloudinary(jwt: string): Promise<string | null> {
    if (!localImageUri) return null;

    const signRes = await fetch(`${BACKEND_URL}/api/v1/uploads/cloudinary/sign`, {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}`, "Content-Type": "application/json" },
      body: JSON.stringify({ folder: "users" }),
    });
    if (!signRes.ok) throw new Error("Falha ao obter assinatura de upload.");
    const { cloudName, apiKey, timestamp, signature, folder } = await signRes.json();

    const filename = localImageUri.split("/").pop() || "avatar.jpg";
    const ext = filename.split(".").pop()?.toLowerCase();
    const mime = ext === "png" ? "image/png" : "image/jpeg";

    const form = new FormData();
    // @ts-ignore (RN file)
    form.append("file", { uri: localImageUri, name: filename, type: mime });
    form.append("api_key", apiKey);
    form.append("timestamp", String(timestamp));
    form.append("signature", signature);
    if (folder) form.append("folder", folder);

    const cloudUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const upRes = await fetch(cloudUrl, { method: "POST", body: form });
    const upJson = await upRes.json();
    if (!upRes.ok) throw new Error(upJson?.error?.message || "Upload no Cloudinary falhou.");

    return upJson.secure_url as string;
  }

  // ————— Salva —————
  async function onSave() {
    try {
      if (!current) return;
      if (!BACKEND_URL) {
        Alert.alert("Configuração", "EXPO_PUBLIC_BACKEND_URL não definida.");
        return;
      }
      setSaving(true);

      const jwt =
        (await getToken({ template: "backend", skipCache: true })) ||
        (await getToken({ template: "backend" }));
      if (!jwt) throw new Error("Não foi possível obter o token.");

      // sobe a foto se o usuário escolheu uma nova localmente
      let finalPhoto = current.photo || null;
      if (localImageUri) {
        finalPhoto = await uploadToCloudinary(jwt);
      }

      // monta o payload preservando campos que a tela não edita
      const payload = {
        id: current.id,                    // ignorado pelo backend (READ_ONLY), mas ok enviar
        name: name.trim(),
        email: email.trim(),               // obrigatório no DTO
        birthday: current.birthday ?? null,
        gender: current.gender ?? null,
        city: city.trim(),
        sports: current.sports ?? [],
        photo: finalPhoto,                 // pode ser null; backend já faz fallback com claims do Clerk
      };

      const res = await fetch(`${BACKEND_URL}/api/v1/users/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Falha ao salvar (${res.status}): ${txt}`);
      }

      const saved: UserResponse = await res.json();
      setCurrent(saved);
      setPhotoUrl(saved.photo || null);
      setLocalImageUri(null);

      Alert.alert("Pronto!", "Perfil atualizado com sucesso.", [
        { text: "OK", onPress: onBack },
      ]);
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Não foi possível salvar o perfil.");
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
        <Text style={styles.headerTitle}>Editar perfil</Text>
        <View style={styles.headerRight} />
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.avatarBox}>
              <Image
                source={
                  photoUrl
                    ? { uri: photoUrl }
                    : require("../../../assets/images/Ellipse 27.png")
                }
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

            {/* A profissão por enquanto é só local, não existe no backend */}
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

const LABEL_WIDTH = 110;
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
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 },
  avatarBox: { alignItems: "center", marginTop: 8, marginBottom: 24 },
  avatar: { width: 128, height: 128, borderRadius: 64, backgroundColor: "#D9D9D9" },
  editPhotoBtn: { marginTop: 12 },
  editPhotoText: { fontSize: 18, color: "#10CF65" },
  fieldRow: { flexDirection: "row", alignItems: "center", paddingTop: 16 },
  label: { width: LABEL_WIDTH, fontSize: 18, color: "rgba(0,0,0,0.5)" },
  input: { flex: 1, fontSize: 18, color: "#000", paddingVertical: 8 },
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
