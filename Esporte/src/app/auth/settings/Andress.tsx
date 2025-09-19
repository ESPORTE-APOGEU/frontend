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
import LargeButton from "@/src/components/ui/Forms/LargeButtom";
import TextInput from "@/src/components/ui/TextInput";
import AntDesign from '@expo/vector-icons/AntDesign';
import { UUID } from 'expo-modules-core/build/uuid/uuid.types.d';
import AddressService from "@/src/services/AddressService";
import { useAuth } from "@clerk/clerk-expo";

export default function Andress() {
  const formErase: Address = {
    id: null,
    Nome: "",
    CEP: "",
    Cidade: "",
    UF: "",
    Bairro: "",
    Rua: "",
    Numero: "",
    Complemento: "",
    padrao: false
  };
    const [myAddress, setMyAddress] = React.useState<Address[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [SavingAddress, setSavingAddress] = React.useState(false);
    const [showFormAddress, setShowFormAddress] = React.useState<boolean>(false);
    const [AndressForm, setAndressForm] = React.useState<Address>(formErase);
    const [findingCEP, setFindingCEP] = React.useState(false);
    // Buscar CEP e completar campos
    const findCEP = async (cep: string) => {
      setFindingCEP(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setAndressForm((prev) => ({
            ...prev,
            Nome: prev.Nome,
            Numero: prev.Numero,
            Complemento: prev.Complemento,
            padrao: prev.padrao,
            Cidade: data.localidade || "",
            UF: data.uf || "",
            Bairro: data.bairro || "",
            Rua: data.logradouro || "",
          }));
        } else {
          console.log("CEP not found");
        }
      } catch (error) {
        console.error("Error fetching CEP:", error);
      } finally {
        setFindingCEP(false);
      }
    };
    const onChangeAndressForm = (field: keyof Address, value: string | boolean) => {
      if (field === "CEP") {
        const formattedValue = value.toString().replace(/\D/g, "").replace(/(\d{5})(\d{1,3})/, "$1-$2").slice(0, 9);
        setAndressForm((prev) => ({ ...prev, [field]: formattedValue }));

        if (formattedValue.length === 9) {
          findCEP(formattedValue);
        }
      } else {
        setAndressForm((prev) => ({ ...prev, [field]: value }));
      }
      if (field === "CEP") {
        const formattedValue = value.toString().replace(/\D/g, "").replace(/(\d{5})(\d{1,3})/, "$1-$2").slice(0, 9);
        setAndressForm((prev) => ({ ...prev, [field]: formattedValue }));
  
        if (formattedValue.length === 9) {
          findCEP(formattedValue);
        }
      } else {
        setAndressForm((prev) => ({ ...prev, [field]: value }));
      }
    };
    // Comunicação com o serviço
    const { getToken, userId } = useAuth();

    const fetchAddresses = async () => {
        setLoading(true);
        const token = await getToken({ template: "backend" });
        console.log("User ID:", userId);
        console.log("Token obtido:", token);
        const addresses = await AddressService.getAddresses(token);
        setMyAddress([...addresses]);
        setLoading(false);
      };
    React.useEffect(() => {
      fetchAddresses();
    }, []);
    const onSaveAddress = async () => {
      setSavingAddress(true);
      const token = await getToken({ template: "backend" });
      try {
        const addresses = await AddressService.saveAddress(token, AndressForm);
        setMyAddress(addresses);
      } catch (error) {
        console.error("Error saving address:", error);
      } finally {
        setLoading(false);
        setShowFormAddress(false);
        setSavingAddress(false);
        setAndressForm({
          id: null,
          Nome: "",
          CEP: "",
          Cidade: "",
          UF: "",
          Bairro: "",
          Rua: "",
          Numero: "",
          Complemento: "",
          padrao: false
        });
      }
    };
  
    const onDeleteAddress = async (id: UUID | null) => {
      if (!id) return;
      setLoading(true);
    const token = await getToken({ template: "backend" });
    try {
      const addresses = await AddressService.deleteAddress(token, id);
      setMyAddress(addresses);
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setLoading(false);
        setShowFormAddress(false);
      }
    };
    const onSetDefaultAddress = async(id: UUID|null) => {
      setLoading(true);
      if (!id) return;
      const token = await getToken({ template: "backend" });
      const addresses = await AddressService.setDefaultAddress(token, id);
      console.log("Response from setting default address:", addresses);
      setMyAddress(addresses);
      setLoading(false);
    };
    // Atualiza formulário e mostra apenas, envio é feito em onSaveAddress
    const onUpdateAddress = (andress:Address) => {
      setShowFormAddress(true);
      setAndressForm(andress);
    }
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
            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={() => {fetchAddresses()}} colors={["#07D362"]}/>}>
                {loading ? (
                    <ActivityIndicator size="large" color="#07D362" className="mt-10" />
                ) : (
                    myAddress.map((address, index) => (
                        <AndressItem 
                            key={address.id ? address.id.toString() : `temp-${index}`} 
                            address={address} 
                            update={onUpdateAddress} 
                            setAsDefault={onSetDefaultAddress}
                            deleteAddress={onDeleteAddress}
                        />
                    ))
                )}
                <View className="mb-4 items-center" >
                    {(myAddress.length <= 2 || loading) && // Limite de 2 endereços
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
                                onPress={() => onSaveAddress()}>
                                <View className="w-[100%] p-2 bg-[#43A047] rounded-lg items-center justify-center">
                                    {SavingAddress ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <Text className="text-white text-lg font-bold">Salvar</Text>
                                    )}
                                </View>
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
