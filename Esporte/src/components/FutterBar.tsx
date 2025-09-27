// components/FutterBar.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import FlutterBar from "@/src/assets/icons/flutter-bar.svg";
import  HomeIcon  from "../assets/icons/home.svg";
import PlusIcon from "../assets/icons/plus.svg";
import ConfigIcon from "../assets/icons/config.svg";
import PeoplesIcon from "../assets/icons/peoples.svg";


export default function BottomNavigation() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();

  const BAR_ASPECT_RATIO = 91 / 400;
  const svgHeight = width * BAR_ASPECT_RATIO;
  const safeBottom = Math.max(insets.bottom, 16);
  const horizontalPadding = width < 360 ? 32 : 48;
  const containerHeight = svgHeight + safeBottom + 32;

  const handleHomePress = () => {
    router.push("/auth/home");
  };

  const handleSearchPress = () => {
    router.push("/auth/profileScreen");
  };

  const handleAddPress = () => {
    router.push("/public/criarEvento");
  };

  // <-- AGORA ESTE BOTÃO FAZ LOGOUT
  const handleExercisesPress = async () => {
    try {
      await signOut(); // encerra a sessão atual do Clerk neste dispositivo
    } catch (e) {
      console.error("Erro ao sair:", e);
      // opcional: mostrar um Alert se quiser
      // Alert.alert('Ops', 'Não consegui sair, vou te mandar pro login assim mesmo.');
    } finally {
      // garante que vai para a tela de login
      router.replace("/auth/sign-in");
    }
  };

  const handleChatbotPress = () => {
    router.push("/auth/settings");
  };

  return (
    <View pointerEvents="box-none" style={[styles.root, { height: containerHeight }]}>
      <FlutterBar
        width={width}
        height={svgHeight}
        preserveAspectRatio="xMidYMid slice"
        style={styles.svg}
      />

      <View
        style={[
          styles.content,
          { paddingBottom: safeBottom, paddingHorizontal: horizontalPadding },
        ]}
      >
  <TouchableOpacity style={[styles.navItem, { marginBottom: 12, marginRight: 6 }]} onPress={handleHomePress}>
          <HomeIcon
            width={24}
            height={24}
            preserveAspectRatio="xMidYMid meet"
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>

  <TouchableOpacity style={[styles.navItem, { marginBottom: 12, marginRight: 20 }]} onPress={handleSearchPress}>
          <PeoplesIcon
            width={24}
            height={24}
            preserveAspectRatio="xMidYMid meet"
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryAction, { marginBottom: safeBottom + 4 }]}
          onPress={handleAddPress}
        >
          <PlusIcon width={28} height={28} color="white" />
        </TouchableOpacity>

  <TouchableOpacity style={[styles.navItem, { marginBottom: 12, marginLeft: 20 }]} onPress={handleExercisesPress}>
          <ConfigIcon
            width={24}
            height={24}
            color="#9CA3AF"
            preserveAspectRatio="xMidYMid meet"
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>

  <TouchableOpacity style={[styles.navItem, { marginBottom: 12, marginLeft: 6 }]} onPress={handleChatbotPress}>
          <Ionicons name="chatbubble-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  svg: {
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
  },
  navItem: {
    width: 54,
    alignItems: "center",
    justifyContent: "center",
  },
  navLabel: {
    marginTop: 4,
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  navLabelActive: {
    color: "#1F2937",
  },
  primaryAction: {
    width: 56,
    height: 56,
    backgroundColor: "#40B843",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    shadowColor: "#40B843",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
