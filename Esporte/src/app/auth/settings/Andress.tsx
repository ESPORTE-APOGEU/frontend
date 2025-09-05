import React from "react";
import { 
    View, 
    Text, 
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    TextInput as CustomTextInput 
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Address } from "@/interfaces/Andress";
import AndressItem from "@/src/components/settings/AndressItem";
import HeaderSettingsPage from "@/src/components/settings/HeaderSettingsPage";
import useSettingsAndress from "@/hooks/SettingsAndress";
import LargeButton from "@/src/components/ui/Forms/LargeButtom";
import TextInput from "@/src/components/ui/TextInput";
import AntDesign from '@expo/vector-icons/AntDesign';
export default function Andress() {
    const [myAddress, setMyAddress] = React.useState<Address[]>([]);
    const [loading, setLoading] = React.useState({myAddress:true, newAddress:false});
    const [showFormAddress, setShowFormAddress] = React.useState(false);
    const { 
        AndressForm, 
        findingCEP, 
        onChangeAndressForm, 
        onUpdateAddress, 
        onGetAddress } = useSettingsAndress();

    const handleUpdateAddress = (andress: Address) => {
        setShowFormAddress(true);
        onUpdateAddress(andress);
    };

    React.useEffect(() => {
        setLoading((prev) => ({ ...prev, myAddress: true }));
        const myAndress = onGetAddress();
        myAndress.then((addresses) => setMyAddress(addresses)).catch((error) => {
            console.error("Failed to fetch addresses:", error);
            setMyAddress([]);
        });
        setLoading((prev) => ({ ...prev, myAddress: false }));
    }, []);

    return (
        <View className="bg-[#F7FFED] min-h-full">
            <HeaderSettingsPage title="Localização"/>
            <KeyboardAwareScrollView
                // A mágica acontece aqui!
                className="flex-1"
                // keyboardVerticalOffset pode ser útil se você tiver um header fixo
                resetScrollToCoords={{ x: 0, y: 0 }} // Coordenadas para onde rolar ao fechar o teclado
                contentContainerStyle={{ flexGrow: 1 }} // A mesma que usamos antes
                scrollEnabled={true}
                // Habilita o ajuste automático no Android
                enableOnAndroid={true}
                // Garante que a rolagem funcione mesmo se o conteúdo for pequeno
                extraScrollHeight={Platform.OS === 'ios' ? 0 : 175} 
                extraHeight={42}
            >
            <ScrollView >{/*refreshControl={<RefreshControl refreshing={loading.myAddress} onRefresh={() => {setLoading((prev) => ({ ...prev, myAddress: true }))}} colors={["#07D362"]}/>}>*/}
                {loading.myAddress ? (
                    <ActivityIndicator size="large" color="#07D362" className="mt-10" />
                ) : (
                    myAddress.map((address, index) => (
                            <AndressItem 
                            key={index} 
                            address={address} 
                            update={() => handleUpdateAddress(address)} />
                    ))
                )}
                <View className="mb-4 items-center" >
                    {myAddress.length < 3 && 
                    <Pressable
                        onPress={() => {setShowFormAddress(!showFormAddress)}}
                        className="w-[90%] p-2 bg-[#43A047] rounded-lg items-center justify-center"
                    >
                        <Text className="text-white text-lg font-bold">Adicionar Novo Endereço</Text>
                    </Pressable>}
                    {showFormAddress && (
                        <View className="w-[90%] mt-2">
                            <View className="flex-row justify-end">
                                <Pressable onPress={() => setShowFormAddress(false)}>
                                    <AntDesign name="closesquare" size={24} color="#43A047"/>
                                </Pressable>
                            </View>
                            <Input
                                label="Nome"
                                placeholder="Ex: Casa, Trabalho"
                                value={AndressForm.Nome}
                                onChangeText={(text) => onChangeAndressForm("Nome", text)}
                            />
                            <Input
                                label="CEP"
                                placeholder="00000-000"
                                value={AndressForm.CEP}
                                onChangeText={(text) => onChangeAndressForm("CEP", text)}
                            />
                            {findingCEP && (
                                <View className="flex-row items-center mb-2">
                                    <ActivityIndicator size="small" color="#07D362" />
                                    <Text>Buscando CEP</Text>
                                </View>
                            )}
                            <View className="flex-row">
                                <View className="w-[10%]">
                                    <Input
                                        label="UF"
                                        placeholder="SP"
                                        value={AndressForm.UF}
                                        onChangeText={(text) => onChangeAndressForm("UF", text)}
                                    />
                                </View>
                                <View className="w-[87%] ml-2">
                                    <Input
                                        label="Cidade"
                                        placeholder="Digite sua cidade"
                                        value={AndressForm.Cidade}
                                        onChangeText={(text) => onChangeAndressForm("Cidade", text)}
                                    />
                                </View>
                            </View>
                            <View>
                                <Input
                                    label="Bairro"
                                    placeholder="Digite seu bairro"
                                    value={AndressForm.Bairro}
                                    onChangeText={(text) => onChangeAndressForm("Bairro", text)}
                                />
                            </View>
                            <View className="flex-row">
                                <View className="w-[48%]">
                                    <Input
                                        label="Rua"
                                        placeholder="Nome da Rua"
                                        value={AndressForm.Rua}
                                        onChangeText={(text) => onChangeAndressForm("Rua", text)}
                                    />
                                </View>
                                <View className="w-[48%] ml-2">
                                    <Input
                                        label="Numero"
                                        placeholder="000"
                                        value={AndressForm.Numero}
                                        onChangeText={(text) => onChangeAndressForm("Numero", text)}
                                    />
                                </View>
                            </View>
                            <Input
                                label="Complemento"
                                placeholder="Digite o complemento"
                                value={AndressForm.Complemento}
                                onChangeText={(text) => onChangeAndressForm("Complemento", text)}
                            />
                            <Pressable
                                onPress={() => {setLoading((prev) => ({ ...prev, myAddress: true }))}}
                                className="w-[100%] p-2 bg-[#43A047] rounded-lg items-center justify-center"
                            >
                                <Text className="text-white text-lg font-bold">Salvar</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </ScrollView>
            </KeyboardAwareScrollView>
        </View>
    );
}
// Outro Componente Input
interface InputProps {
    label: string;
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
}

function Input({ label, placeholder, value, onChangeText }: InputProps) {
    return (
        <View className="mb-4 w-full items-center font-[Poppins-Regular] ">
            <View className={`w-[99%]`}>
                <Text className=" mb-0.5" accessibilityLabel={label}>
                    {label}
                </Text>
            </View>
            <View className=" w-full rounded-lg border-b border-green-700 ">
                <CustomTextInput
                    placeholder={placeholder}
                    placeholderTextColor="rgba(0,0,0,0.5)"
                    value={value}
                    onChangeText={onChangeText}
                    className={`h-10 w-full bg-[#F7FFED] px-2 rounded-lg border-gray-100`}
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 4, height: 6 }, // direita e baixo
                        shadowOpacity: 0.4,
                        shadowRadius: 8,
                        elevation: 12, // pro Android
                    }}
                />
            </View>
        </View>
    );
}
