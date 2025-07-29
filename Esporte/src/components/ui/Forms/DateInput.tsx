import React, { useState } from 'react';
import { View, Button, Platform, Text, Pressable} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
interface DateInputProps {
  value?: Date | null; // Permite que o valor seja nulo inicialmente
  onChange?: (date: Date) => void;
  label?: string;
  placeholder?: string;
}

export default function DateInput({ value, onChange, label, placeholder }: DateInputProps) {

    const [PTBRformat,setPTBRformat ] = React.useState('')
    const [show, setShow] = useState(false);

    const formatDatePTBR = (date: Date): string => {
        const meses = [
          'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
          'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
        ];
        const dia = date.getDate();
        const mes = meses[date.getMonth()];
        const ano = date.getFullYear();
        return `${dia} de ${mes} de ${ano}`;
    };

    const onChangeInput = (_event: any, selectedDate?: Date) => {
        setShow(false);
        if (selectedDate) {
            onChange?.(selectedDate);
            setPTBRformat(formatDatePTBR(selectedDate));
        }
    };

  return (
    <View className="mb-4 w-full items-center font-[Poppins-Regular]">
        <View className="w-[80%]">
            <Text className="font-[Poppins-Bold] mb-0.5 font-bold" accessibilityLabel={label}>
                {label}
            </Text>
            <View
                className="bg-neutral-100/95 rounded-lg"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 4, height: 6 },
                    shadowOpacity: 0.4,
                    shadowRadius: 8,
                    elevation: 12,
                }}>
                <Pressable 
                    onPress={() => setShow(true)} 
                    className="bg-neutral-100/95 border-b border-green-700 relative p-3 rounded-lg items-center justify-center"
                >
                    <Text className="text-gray-500 text-center">
                        {PTBRformat ? PTBRformat : placeholder}
                    </Text>
                </Pressable>
            </View>
            {show && (
            <DateTimePicker
            value={value || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeInput}
            maximumDate={new Date()}
            accentColor='#15803d'
            />
        )}
        </View>
    </View>

  );
}
