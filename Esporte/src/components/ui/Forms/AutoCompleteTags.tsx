import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, ScrollView } from 'react-native';

interface Option {
  label: string;
  value: string;
}

interface Props {
  options: Option[];
  onSearch?: (query: string) => void;
  onSelect: (selected: string[]) => void;
}

const SearchSelectVariosInput: React.FC<Props> = ({ options, onSearch, onSelect }) => {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState<Option[]>(options);
  const [selected, setSelected] = useState<Option[]>([]);

  useEffect(() => {
    if (onSearch) {
      onSearch(query);
    } else {
      const lower = query.toLowerCase();
      setFiltered(options.filter(o => o.label.toLowerCase().includes(lower)));
    }
  }, [query, options]);

  const toggleSelect = (item: Option) => {
    let updated: Option[];
    if (selected.some(s => s.value === item.value)) {
      updated = selected.filter(s => s.value !== item.value);
    } else {
      updated = [...selected, item];
    }
    setSelected(updated);
    onSelect(updated.map(i => i.value));
  };

  const removeTag = (value: string) => {
    const updated = selected.filter(s => s.value !== value);
    setSelected(updated);
    onSelect(updated.map(i => i.value));
  };

  return (
    <View style={{ padding: 10 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
        {selected.map(item => (
          <TouchableOpacity
            key={item.value}
            onPress={() => removeTag(item.value)}
            style={{
              backgroundColor: '#ccc',
              borderRadius: 16,
              paddingHorizontal: 12,
              paddingVertical: 4,
              margin: 4,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text>{item.label} ✕</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Digite para buscar..."
        value={query}
        onChangeText={setQuery}
        style={{
          borderColor: '#aaa',
          borderWidth: 1,
          borderRadius: 8,
          padding: 10,
        }}
      />

      <ScrollView style={{ maxHeight: 200, marginTop: 8 }}>
        {filtered.map(item => (
          <TouchableOpacity
            key={item.value}
            onPress={() => toggleSelect(item)}
            style={{
              padding: 10,
              backgroundColor: selected.some(s => s.value === item.value) ? '#eee' : '#fff',
              borderBottomWidth: 1,
              borderBottomColor: '#ddd',
            }}
          >
            <Text>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default SearchSelectVariosInput;
