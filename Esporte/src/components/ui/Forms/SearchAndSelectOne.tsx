import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  selectedValue: string | null;
  onValueChange: (value: string | null) => void;
  options: Option[];
  placeholder?: string;
  onSearch?: (query: string) => void;
  highlightColor?: string;
}

const SearchAndSelectOne: React.FC<Props> = ({
  label,
  selectedValue,
  onValueChange,
  options,
  placeholder = 'Selecione...',
  onSearch,
  highlightColor = '#10b981',
}) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(options);

  useEffect(() => {
    setItems(options);
  }, [options]);

  return (
    <View style={{ marginBottom: 16, width: '100%', alignItems: 'center' }}>
      <View style={{ width: '80%' }}>
        <Text style={{ fontFamily: 'Poppins-Bold', marginBottom: 4 }}>{label}</Text>

        <DropDownPicker<string>
          open={open}
          setOpen={setOpen}
          value={selectedValue}
          setValue={(val) => {
            if (typeof val === 'function') {
              // If val is a function, call it with current selectedValue
              const result = val(selectedValue);
              onValueChange(result as string | null);
            } else {
              onValueChange(val as string | null);
            }
          }}
          items={items}
          setItems={setItems}
          multiple={false}
          mode="SIMPLE"
          placeholder={placeholder}
          searchable={!!onSearch}
          onChangeSearchText={(text) => onSearch?.(text)}
          style={{
            backgroundColor: '#f3f4f6',
            borderColor: highlightColor,
            borderRadius: 8,
            minHeight: 60,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 2, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
          }}
          dropDownContainerStyle={{
            backgroundColor: '#fff',
            borderColor: highlightColor,
          }}
          textStyle={{
            fontFamily: 'Poppins-Regular',
          }}
          placeholderStyle={{
            color: '#9ca3af',
          }}
          selectedItemLabelStyle={{
            fontWeight: 'bold',
            color: highlightColor,
          }}
        />

        {selectedValue && (
          <TouchableOpacity onPress={() => onValueChange(null)} style={{ marginTop: 8 }}>
            <Text style={{ color: 'red' }}>Remover seleção</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SearchAndSelectOne;
