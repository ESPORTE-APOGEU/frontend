// components/FutterBar.tsx
import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Image,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

import FlutterBar from "@/src/assets/icons/flutter-bar.svg";
import HomeIcon from "../assets/icons/home.svg";
import PlusIcon from "../assets/icons/plus.svg";
import ConfigIcon from "../assets/icons/config.svg";
import PeoplesIcon from "../assets/icons/peoples.svg";

export default function BottomNavigation() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { user } = useUser();

  const BAR_ASPECT_RATIO = 91 / 400;
  const svgHeight = width * BAR_ASPECT_RATIO;

  const safeBottom = Math.max(insets.bottom, 16);
  const horizontalPadding = width < 360 ? 32 : 48;
  const containerHeight = svgHeight + safeBottom;

  const NOTCH_RISE = svgHeight * 0.38;
  const FAB_SIZE = 56;
  const fabLeft = width / 2 - FAB_SIZE / 2;
  const ICON_DROP = svgHeight * 0.36;

  const handleHomePress = () => router.push("/auth/home");
  const handlePeoplesPress = () => router.push("/FriendsScreen");
  const handleAddPress = () => router.push("/public/criarEvento");
  const handleSettingsPress = () => router.push("/auth/settings");
  const handleProfilePress = () => router.push("/auth/profileScreen");

  const photoUrl = user?.imageUrl ?? undefined;
  const initials =
    user?.firstName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "U";

  return (
    <View pointerEvents="box-none" style={[styles.root, { height: containerHeight + 20 }]}>
      <FlutterBar
        width={width}
        height={svgHeight}
        preserveAspectRatio="xMidYMid slice"
        style={styles.svg}
        pointerEvents="none"
      />

      <View
        style={[
          styles.content,
          {
            height: svgHeight,
            paddingHorizontal: horizontalPadding,
            bottom: safeBottom,
            paddingTop: ICON_DROP,
          },
        ]}
      >
        <TouchableOpacity style={styles.navItem} onPress={handleHomePress}>
          <HomeIcon width={24} height={24} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={handlePeoplesPress}>
          <PeoplesIcon width={24} height={24} />
        </TouchableOpacity>

        <View style={{ width: FAB_SIZE }} />

        {/* Config leva para a página de settings */}
        <TouchableOpacity style={styles.navItem} onPress={handleSettingsPress}>
          <ConfigIcon width={24} height={24} />
        </TouchableOpacity>

        {/* Avatar do usuário (perfil) */}
        <TouchableOpacity style={styles.navItem} onPress={handleProfilePress}>
          {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>{initials}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.primaryAction,
          {
            width: FAB_SIZE,
            height: FAB_SIZE,
            left: fabLeft,
            bottom: safeBottom + NOTCH_RISE,
            borderRadius: FAB_SIZE / 2,
          },
        ]}
        onPress={handleAddPress}
      >
        <PlusIcon width={28} height={28} />
      </TouchableOpacity>
    </View>
  );
}

const AVATAR_SIZE = 28;

const styles = StyleSheet.create({
  root: { position: "absolute", left: 0, right: 0, bottom: 0, justifyContent: "flex-end" },
  svg: { position: "absolute", left: 0, right: 0, bottom: 0 },
  content: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  navItem: { width: 54, alignItems: "center", justifyContent: "center" },
  primaryAction: {
    position: "absolute",
    backgroundColor: "#40B843",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#40B843",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 },
  avatarFallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: { color: "#111827", fontWeight: "700" },
});
