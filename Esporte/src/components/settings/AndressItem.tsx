import React from "react";
import { View, Text } from "react-native";
import { Address } from "@/interfaces/Andress";
import LocationIcon from "../icons/location";
import {SimpleLineIcons} from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import useSettingsAndress from "@/hooks/SettingsAndress";
import { UUID } from "expo-modules-core/build/uuid/uuid.types";
interface AndressItemProps {
    address: Address;
    update: (address: Address) => void;
    setAsDefault: (id: UUID | null) => void;
    deleteAddress: (id: UUID | null) => void;
}

export default function AndressItem({ address , update, setAsDefault, deleteAddress}: AndressItemProps) {

    const { ContextMenu } = renderers;
   // const { onDeleteAddress, onSetDefaultAddress } = useSettingsAndress();

    return (
        <View className="flex-row justify-between p-4 mx-6 my-2 border rounded-xl border-[#000000A3]">
            <View className="flex-row items-center">
                <LocationIcon showMap={false} color="#000000A3"/>
            </View>
            <View className="flex-1 ml-4 ">
                <Text className="text-lg font-medium">{address.Nome}</Text>
                <Text className="text-gray-600 font-extralight">{address.Rua}, {address.Numero} {address.Complemento}</Text>
                <Text className="text-gray-600 font-extralight">{address.Bairro}</Text>
                <Text className="text-gray-600 font-extralight">{address.Cidade}/{address.UF}</Text>
            </View>
            <View className="flex-row items-start">
                {address.padrao && <AntDesign name="checkcircle" size={20} color="#10CF65"  />}
                <Menu renderer={ContextMenu}>
                    <MenuTrigger>
                        <SimpleLineIcons name="options-vertical" size={16} color="#000000A3"/>
                    </MenuTrigger>
                    <MenuOptions 
                        optionsContainerStyle={{
                            marginTop: 30, 
                            marginRight: 10,
                            borderRadius: 8,
                            overflow: 'hidden',
                            backgroundColor: '#F7FFED',
                        }}>
                        {address.padrao || 
                        <MenuOption onSelect={() => setAsDefault(address.id)}>
                            <Text className="text-gray-900 font-extralight">Definir como padrão</Text>
                        </MenuOption>}
                        <MenuOption onSelect={() => update(address)}>
                            <Text className="text-gray-900 font-extralight">Editar</Text>
                        </MenuOption>
                        <MenuOption onSelect={() => deleteAddress(address.id)}>
                            <Text className="text-gray-900 font-extralight">Deletar</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>

            </View>
        </View>
    );
}
