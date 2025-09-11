import { Stack } from 'expo-router';
import { MenuProvider } from 'react-native-popup-menu'
export default function SettingsLayout() {
  return (
    <MenuProvider>
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
    </MenuProvider>
  );
}
