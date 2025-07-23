import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  selectedValue: string;
  onValueChange: (itemValue: string, itemIndex: number) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
}

const DropDownInput: React.FC<Props> = ({
  label,
  selectedValue,
  onValueChange,
  options,
  placeholder,
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(options);

  return (
    <View className="mb-4 w-full items-center font-[Poppins-Regular]"
        style={{ width: '100%', alignItems: 'center' , marginBottom: 16 }}>
      <View className="w-[80%]"
        style={{width: '80%'}}>
        <Text className="font-[Poppins-Bold] mb-1">{label}</Text>
        <DropDownPicker
          open={open}
          value={selectedValue}
          items={items}
          setOpen={setOpen}
          setValue={(callback) => {
            const newValue = callback(selectedValue);
            const index = items.findIndex((i) => i.value === newValue);
            onValueChange(newValue as string, index);
          }}
          setItems={setItems}
          placeholder={placeholder}
          style={{
            backgroundColor: '#f3f4f6',
            borderColor: '#047857',
            borderRadius: 8,
            minHeight: 60,
            elevation: 12,
            shadowColor: '#000',
            shadowOffset: { width: 4, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
          }}
          dropDownContainerStyle={{
            backgroundColor: '#fff',
            borderColor: '#047857',
          }}
          textStyle={{
            fontFamily: 'Poppins-Regular',
          }}
          placeholderStyle={{
            color: '#9ca3af',
          }}
        />
      </View>
    </View>
  );
};

export default DropDownInput;
