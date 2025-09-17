import { UUID } from './../node_modules/expo-modules-core/build/uuid/uuid.types.d';
export interface Address {
    id: UUID | null;
    Nome: string;
    CEP: string;
    Cidade: string;
    UF: string;
    Bairro: string;
    Rua: string;
    Numero: string;
    Complemento: string;
    padrao: boolean;
}
