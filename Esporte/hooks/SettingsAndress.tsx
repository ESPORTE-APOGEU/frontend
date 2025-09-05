import React from "react";
import { Address } from "@/interfaces/Andress";
import { UUID } from 'expo-modules-core/build/uuid/uuid.types.d';

export default function useSettingsAndress() {
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

  // Bride Service
  const onGetAddress = async () => {
    let myAddress: Address[] = [];
    setTimeout(() => {
        myAddress = [{
            id: "550e8400-e29b-41d4-a716-446655440000" as unknown as UUID,
            Nome: "João da Silva",
            CEP: "12345-678",
            Cidade: "São Paulo",
            UF: "SP",
            Bairro: "Centro",
            Rua: "Rua Exemplo",
            Numero: "123",
            Complemento: "Apto 456",
            padrao: true
        },{
            id: "550e8400-e29b-41d4-a716-446655440001" as unknown as UUID,
            Nome: "Maria Oliveira",
            CEP: "87654-321",
            Cidade: "Rio de Janeiro",
            UF: "RJ",
            Bairro: "Pavuna",
            Rua: "Rua Exemplo 2",
            Numero: "456",
            Complemento: "Casa 789",
            padrao: false
        }] as Address[];
    }, 1000);
    return myAddress;
  };
  const onUpdateAddress = (andress:Address) => {
    setAndressForm(andress);
  }
  return { AndressForm, findingCEP, onChangeAndressForm, onUpdateAddress, onGetAddress };
}
