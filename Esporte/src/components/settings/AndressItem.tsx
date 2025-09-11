import React from "react";
import { View, Text } from "react-native";
import { Address } from "@/interfaces/Andress";
import LocationIcon from "../icons/location";
import {SimpleLineIcons} from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function AndressItem({ address }: { address: Address }) {
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
                <SimpleLineIcons name="options-vertical" size={16} color="#000000A3"/>

            </View>
        </View>
    );
}
