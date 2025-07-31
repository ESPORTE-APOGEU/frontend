import { Stack } from "expo-router";
import "../styles/global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth/home" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="public" />
    </Stack>
  );
}
