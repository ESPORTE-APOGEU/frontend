import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ReportModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (reason: string, description: string) => void;
};

export default function ReportModal({ visible, onClose, onSubmit }: ReportModalProps) {
  const [reason, setReason] = useState<string>('Conduta antidesportiva');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (visible) {
      setReason('Conduta antidesportiva');
      setDescription('');
    }
  }, [visible]);

  const reasons = ['Conduta antidesportiva', 'Fraude no pagamento', 'Infraestrutura precária', 'Outros'];

  const handleSelect = (r: string) => setReason((prev) => (prev === r ? '' : r));

  const handleSubmit = () => {
    onSubmit?.(reason, description);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-2xl p-5 max-h-[92%] w-full relative">
            <TouchableOpacity className="absolute left-3 top-3 p-1.5 z-10" onPress={onClose}>
              <Ionicons name="arrow-back" size={20} color="#222" />
            </TouchableOpacity>

            <Text className="text-center text-2xl text-[#111] font-bold mt-2">O que você gostaria de{"\n"}reportar?</Text>
            <Text className="text-center text-base text-gray-500 mt-1 mb-1">Sua ação é anônima. Em caso de perigo, contate os serviços de emergência local imediatamente.</Text>

            <View className="mt-3">
              {reasons.map((r) => {
                const selected = r === reason;
                return (
                  <TouchableOpacity key={r} className="flex-row justify-between items-center py-3" onPress={() => handleSelect(r)}>
                    <Text className="text-[15px] text-[#111] font-semibold">{r}</Text>
                    <Ionicons name={selected ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={selected ? '#00D36C' : '#A3A3A3'} />
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className="self-start text-[16px] text-[#333] ml-1 mb-1 font-semibold mt-3">Descrição</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Escreva aqui a descrição do ocorrido (opcional)"
              multiline
              className="w-full min-h-[120px] border border-gray-200 rounded-lg p-2.5 mt-1 text-[15px] text-top"
            />

            <TouchableOpacity className={`bg-[#00D36C] py-3 rounded-lg w-full items-center mt-3 ${!reason ? 'opacity-50' : ''}`} onPress={handleSubmit} disabled={!reason}>
              <Text className="text-white font-bold text-lg">Reportar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
