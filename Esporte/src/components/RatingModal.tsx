import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type RatingModalProps = {
  visible: boolean;
  onClose: () => void;
  user?: {
    name?: string;
    image?: any;
  };
  onSubmit?: (rating: number, level: string | null, description: string) => void;
};

export default function RatingModal({ visible, onClose, user, onSubmit }: RatingModalProps) {
  const [rating, setRating] = useState<number>(4);
  const [level, setLevel] = useState<string | null>('Intermediário');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (visible) {
      setRating(4);
      setLevel('Intermediário');
      setDescription('');
    }
  }, [visible]);

  const levels = ['Iniciante', 'Intermediário', 'Avançado', 'Semiprofissional'];

  const handleStarPress = (i: number) => setRating(i);

  const handleLevelPress = (lvl: string) => setLevel((prev) => (prev === lvl ? null : lvl));

  const handleSubmit = () => {
    onSubmit?.(rating, level, description);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-2xl p-5 max-h-[85%] w-full">
            <View className="items-center mb-1.5">
              <Text className="text-center text-[14px] text-[#222] mb-2">Olá!{"\n"}Ajude-nos a melhorar nossa comunidade!{"\n"}Por favor, avalie esse usuário:</Text>
            </View>

            <Image source={user?.image || require('../assets/images/participante.png')} className="w-[92px] h-[92px] rounded-full mt-2 mb-2 self-center" />
            <Text className="font-bold text-[18px] mb-2 text-center self-center">{user?.name || 'Stefane Brito'}</Text>

            <Text className="self-start text-[13px] text-[#333] ml-1 mt-1 mb-1 font-semibold">Nota de comunidade:</Text>
            <View className="flex-row items-center justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity key={i} onPress={() => handleStarPress(i)} className="p-1.5">
                  <Ionicons name={i <= rating ? 'star' : 'star-outline'} size={28} color={i <= rating ? '#00D36C' : '#A3A3A3'} />
                </TouchableOpacity>
              ))}
            </View>

            <Text className="self-start text-[13px] text-[#333] ml-1 mt-3 mb-1 font-semibold">Nível de habilidade:</Text>
            <View className="flex-row flex-wrap justify-start w-full">
              {levels.map((lvl) => (
                <TouchableOpacity
                  key={lvl}
                  onPress={() => handleLevelPress(lvl)}
                  className={`px-2.5 py-1.5 rounded-full bg-[#F0F0F0] mr-2 mt-1 ${level === lvl ? 'bg-[#00D36C]' : ''}`}
                >
                  <Text className={`text-[#333] font-semibold ${level === lvl ? 'text-white' : ''}`}>{lvl}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="self-start text-[13px] text-[#333] ml-1 mt-3 mb-1 font-semibold">Descrição</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Escreva aqui a descrição da avaliação (opcional)"
              multiline
              className="w-full min-h-[80px] border border-gray-200 rounded-lg p-2.5 mt-1 text-top"
            />

            <TouchableOpacity className="bg-[#00D36C] py-3 rounded-lg w-full items-center mt-3" onPress={handleSubmit}>
              <Text className="text-white font-bold text-[16px]">Avaliar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
