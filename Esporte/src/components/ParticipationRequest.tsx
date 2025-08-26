// components/ParticipationRequest.tsx

import { View, Text, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';

interface ParticipationRequestProps {
  userImage: ImageSourcePropType;
  userName: string;
  timestamp: string;
  entryId?: number; // id do event-entry retornado pelo backend
  onAccept: (entryId: number) => void;
  onDecline: (entryId: number) => void;
}

const ParticipationRequest: React.FC<ParticipationRequestProps> = ({
  userImage,
  userName,
  timestamp,
  onAccept,
  onDecline,
  entryId,
}: ParticipationRequestProps) => {
  return (
    // Container principal:
    // - flex-row: alinha os filhos horizontalmente.
    // - items-center: centraliza os filhos verticalmente.
    // - justify-between: empurra o bloco de usuário para a esquerda e os ícones para a direita.
    // - p-2 mb-2: adiciona um pouco de preenchimento e margem.
    <View className="flex-row items-center justify-between p-2 mb-2">

      {/* Bloco de Informações do Usuário (Imagem + Textos) */}
      <View className="flex-row items-center -left-3">
        <Image source={userImage} className="w-14 h-14 rounded-full" />
        <View className="ml-3">
          <Text className="text-lg font-bold text-black">{userName}</Text>
          <Text className="text-base text-gray-600">quer participar do evento</Text>
          <Text className="text-sm text-gray-500">{timestamp}</Text>
        </View>
      </View>

      {/* Bloco de Ações (Ícones) */}
      <View className="flex-row items-center">
        {/* Ícone de Aceitar */}
        <TouchableOpacity onPress={() => onAccept(entryId ?? -1)} className="p-2">
          <Text className="text-green-500 text-2xl font-bold">✓</Text>
        </TouchableOpacity>

        {/* Ícone de Recusar */}
        <TouchableOpacity onPress={() => onDecline(entryId ?? -1)} className="p-2 ml-2">
          <Text className="text-red-500 text-3xl font-bold">×</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default ParticipationRequest;