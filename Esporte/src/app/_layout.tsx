import { Slot } from "expo-router";
import { useFonts } from  'expo-font'

export default function RootLayout() {
  const [fontsLoader] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf')
  })
  if(!fontsLoader) return

  return <Slot />;
}
