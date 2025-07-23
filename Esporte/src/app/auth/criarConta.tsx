import { View, Text, Pressable, Image } from "react-native";

export default function CriarContaScreen() {
  return (
    <View>
      {/*<HeaderCreateAccount />*/}
      <View className="p-16 h-64 bg-[#07D362] rounded-bl-[10%]">
        <Pressable>
          <Image source={require('@/src/assets/images/seta-voltar.png')}
          />
        </Pressable>
        <Text className="text-5xl font-bold text-white p-4 font-Poppins">Criar Conta</Text>
      </View>
      <Text className="text-2xl font-bold">Tela após logado (Criar Conta)</Text>
    </View>
  );
}