import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  selectedValues: string[];
  onValuesChange: (values: string[]) => void;
  options: Option[];
  placeholder?: string;
  onSearch?: (query: string) => void;
  highlightColor?: string;
}

const SearchAndSelectList: React.FC<Props> = ({
  label,
  selectedValues,
  onValuesChange,
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

  const removeValue = (val: string) => {
    onValuesChange(selectedValues.filter((v) => v !== val));
  };

  return (
    <View style={{ marginBottom: 16, width: '100%', alignItems: 'center' }}>
      <View style={{ width: '80%' }}>
        <Text style={{ fontFamily: 'Poppins-Bold', marginBottom: 4 }}>{label}</Text>

        <DropDownPicker<string>
          showBadgeDot={false}
          showTickIcon={false}
          badgeColors="transparent"
          open={open}
          setOpen={setOpen}
          value={selectedValues}
          setValue={(val) => onValuesChange(val as unknown as string[])}
          items={items}
          setItems={setItems}
          multiple={true}
          mode="BADGE"
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
          {selectedValues.map((val) => {
            const item = items.find((i) => i.value === val);
            return (
              <View
                key={val}
                style={{
                  flexDirection: 'row',
                  backgroundColor: highlightColor,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 20,
                  marginRight: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: 'white', marginRight: 6 }}>{item?.label || val}</Text>
                <TouchableOpacity onPress={() => removeValue(val)}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>×</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default SearchAndSelectList;
