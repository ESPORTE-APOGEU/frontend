import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Configurações' , 
          statusBarStyle: 'dark', 
          headerShown: false }} 
      />
      <Stack.Screen 
        name="Andress" 
        options={{ 
          title: 'Endereço' , 
          statusBarStyle: 'dark', 
          headerShown: false }} 
      />
    </Stack>
  );
}
