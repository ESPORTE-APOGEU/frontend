import { View, Text } from "react-native";

export function Text1() {
    return (
        <View className="w-80">
            <Text className="text-white text-5xl font-semibold text-center">
                Bem Vindo ao {"\n"}Join!!
            </Text>
        </View>
    );
}

export function Text2() {
    return (
        <View className="w-80">
            <Text className="text-white text-4xl font-semibold text-center">
                Encontre sua Galera
            </Text>
            <Text className="text-white text-xl font-light text-center">
                Encontre pessoas para se juntar a você nas suas atividades físicas
            </Text>
        </View>
    );
}

export function Text3() {
    return (
        <View className="w-80">
            <Text className="text-white text-4xl font-semibold text-center">
                Entre na diversão
            </Text>
            <Text className="text-white text-xl font-light text-center">
                Junte-se a eventos de amigos  ou crie seus próprios eventos, deixando-os públicos ou privados
            </Text>
        </View>
    );
}

export function Text4() {
    return (
        <View className="w-80">
            <Text className="text-white text-4xl font-semibold text-center">
                Expanda Seus Limites
            </Text>
            <Text className="text-white text-xl font-light text-center">
                Quanto mais sua rede de amigos cresce, mais fácil é encontrar pessoas 
            </Text>
        </View>
    );
}