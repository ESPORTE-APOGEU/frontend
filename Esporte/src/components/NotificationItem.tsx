import React, { useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons"; // << ícones vetoriais
import { formatRelativeTime } from "../utils/date";
import * as WebBrowser from "expo-web-browser";     // << opcional, melhor UX

type Variant = "accepted" | "reminder" | "location" | "info";
type IconName = "whatsapp" | "calendar" | "info";

type Props = {
  variant: Variant;
  title: string;
  message?: string;
  strongText?: string;
  extraText?: string;
  timestamp: string;
  iconName?: IconName;
  tagText?: string;
  tagUrl?: string;
};

export default function NotificationItem({
  variant,
  title,
  message,
  strongText,
  extraText,
  timestamp,
  iconName = "info",
  tagText,
  tagUrl,
}: Props) {
  
  const openTagUrl = useCallback(async () => {
    const raw = (tagUrl || "").trim();
    if (!raw) return;

    // normaliza: garante http(s)://
    const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

    try {
      // tente abrir em uma aba do navegador (Chrome Custom Tabs / SFSafariViewController)
      const res = await WebBrowser.openBrowserAsync(url);
      // se preferir sair do app por completo, troque pela linha abaixo:
      // await Linking.openURL(url);
    } catch (e) {
      // fallback
      const can = await Linking.canOpenURL(url);
      if (can) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Não foi possível abrir o link", url);
      }
    }
  }, [tagUrl]);

  
  const renderPill = () =>
    !!tagText && (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={openTagUrl}
        style={styles.pill}
      >
        <Text style={styles.pillText}>{tagText}</Text>
        {/* Ícone do WhatsApp no “pill” */}
        <FontAwesome name="whatsapp" size={16} color="#10CF65" style={{ marginLeft: 2 }} />
      </TouchableOpacity>
    );

  const renderMainIcon = () => {
    // ícone branco em cima do retângulo verde
    if (iconName === "whatsapp") return <FontAwesome name="whatsapp" size={20} color="#FFFFFF" />;
    if (iconName === "calendar") return <Feather name="calendar" size={20} color="#FFFFFF" />;
    return <Feather name="info" size={20} color="#FFFFFF" />;
  };

  return (
    <View style={styles.container}>
      {/* Fundo do ícone no estilo do Figma (mantive a imagem RETANGULO) */}
      <ImageBackground
        source={require("../assets/images/RETANGULO.png")}
        style={styles.iconBg}
        imageStyle={{ borderRadius: 12 }}
      >
        {renderMainIcon()}
      </ImageBackground>

      {/* Conteúdo */}
      <View style={styles.content}>
        {!!title && <Text style={styles.title}>{title}</Text>}

        {(message || strongText || extraText) && (
          <Text style={styles.message}>
            {message ? <Text style={styles.message}>{message} </Text> : null}
            {strongText ? <Text style={styles.strong}>{strongText}</Text> : null}
            {extraText ? <Text style={styles.message}> {extraText}</Text> : null}
          </Text>
        )}

        {/* Rodapé: timestamp à esquerda e pill à direita (somente no “accepted”) */}
        <View style={styles.footerRow}>
          <Text style={styles.timestamp}>{formatRelativeTime(timestamp)}</Text>
          {variant === "accepted" ? renderPill() : <View />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", paddingVertical: 12, paddingHorizontal: 16, marginBottom: 8 },
  iconBg: { width: 40, height: 38, alignItems: "center", justifyContent: "center", marginRight: 12 },
  content: { flex: 1 },
  title: { fontFamily: "Poppins", fontWeight: "500", fontSize: 20, lineHeight: 30, color: "#000" },
  message: { fontSize: 16, lineHeight: 19, color: "#000", marginTop: 2 },
  strong: { fontSize: 16, lineHeight: 19, color: "#000", fontWeight: "700" },

  footerRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timestamp: { fontSize: 12, color: "#969696", fontWeight: "600" },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.6,
    borderColor: "rgba(114,113,113,0.71)",
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 25,
    // se precisar “abrir espaço” do lado direito, ajuste essa margem:
    marginRight: 60,
  },
  pillText: { fontSize: 10, fontWeight: "500", color: "#000", marginRight: 6 },
});
