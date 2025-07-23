import { Slot } from "expo-router";
import { useFonts } from  'expo-font'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
  })
  if(!fontsLoaded) return null

  return <Slot />;
}
