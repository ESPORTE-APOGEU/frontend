// Caminho: src/components/ui/OptionSelector.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { images } from "../assets/images";

type Props = {
  title: string;
  options: string[];
  selectedValues: string[] | string;
  onSelect: (option: string) => void;
  isMultiSelect?: boolean;
};

export function OptionSelector({
  title,
  options,
  selectedValues,
  onSelect,
  isMultiSelect = false,
}: Props) {
  return (
    <View className="mb-4">
      <Text className="text-black font-medium text-[15px] mb-2">{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="w-full"
        contentContainerStyle={{ gap: 12 }}>
        {options.map((option, index) => {
          const isSelected = isMultiSelect
            ? (selectedValues as string[]).includes(option)
            : selectedValues === option;

          // Definir qual ícone usar
          let iconSource;
          if (index === 0) iconSource = images.Icon1;
          else if (index === 1) iconSource = images.Icon2;
          else if (index === 2) iconSource = images.Icon3;
          else if (index === 3) iconSource = images.Icon4;
          else iconSource = images.Icon4;

          return (
            <TouchableOpacity
              key={option}
              onPress={() => onSelect(option)}
              className={`px-3 h-9 rounded-[10px] border ${
                isSelected
                  ? "bg-[#43A047] border-[#43A047]"
                  : "bg-white/75 border-black/50"
              } items-center justify-center flex-row shadow-sm`}>
              {title === "Modalidade" && (
                <Image
                  source={iconSource}
                  style={{ width: 14, height: 14, marginRight: 6 }}
                />
              )}
              <Text
                numberOfLines={1}
                className={`text-xs ${
                  isSelected ? "text-white" : "text-[#263238]"
                }`}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
