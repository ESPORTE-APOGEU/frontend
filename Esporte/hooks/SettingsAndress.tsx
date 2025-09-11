import React from "react";
import { Address } from "@/interfaces/Andress";
import { UUID } from 'expo-modules-core/build/uuid/uuid.types.d';
import AddressService from "@/src/services/AddressService";
import { Alert } from "react-native";

export default function useSettingsAndress() {
  const [myAddress, setMyAddress] = React.useState<Address[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showFormAddress, setShowFormAddress] = React.useState<boolean>(false);
  const [AndressForm, setAndressForm] = React.useState<Address>({
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
  const [findingCEP, setFindingCEP] = React.useState(false);
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
        // Trigger action when CEP is complete
        findCEP(formattedValue);
        // Add your action here
      }
    } else {
      setAndressForm((prev) => ({ ...prev, [field]: value }));
    }
  };
  const fetchAddresses = async (updatedData: Address[] | null = null) => {
      setLoading(true );
      if (updatedData) {
        setMyAddress([...updatedData]);
      } else {
        const addresses = await AddressService.getAddresses();
        setMyAddress([...addresses]);
      }
      setLoading(false);
    };
  /*React.useEffect(() => {
    fetchAddresses();
  }, []);*/
  const onSaveAddress = async () => {
    setLoading(true);
    try {
      const addresses = await AddressService.saveAddress(AndressForm);
      setMyAddress(addresses);
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteAddress = async (id: UUID | null) => {
    if (!id) return;
    setLoading(true);
    try {
      const addresses = await AddressService.deleteAddress(id);
      setMyAddress(addresses);
      setMyAddress((prev) => prev.filter((address) => address.id !== id));
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setLoading(false);
      setShowFormAddress(false);
    }
  };
  const onSetDefaultAddress = async(id: UUID|null) => {
    if (!id) {Alert.alert("Invalid address ID"); return;}
    setLoading(true );
    console.log("Setting default address:", id);
    const addresses = await AddressService.setDefaultAddress(id);
    await fetchAddresses(addresses)
    setLoading(false);
    console.log("Endereços retornados:", addresses);
    console.log("Tipo da resposta:", typeof addresses, Array.isArray(addresses));
  };
  const onUpdateAddress = (andress:Address) => {
    console.log("Updating address:", andress);
    setShowFormAddress(true);
    //setMyAddress([]);
  }
  return { AndressForm, findingCEP, onChangeAndressForm, onUpdateAddress, fetchAddresses,
    myAddress, loading, showFormAddress, setShowFormAddress, setAndressForm, onDeleteAddress, onSaveAddress, onSetDefaultAddress
   };
}
