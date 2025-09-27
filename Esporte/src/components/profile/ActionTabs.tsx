// components/profile/ActionTabs.tsx
import React from "react";
import { View, Pressable, Text } from "react-native";

export type ActionTabKey = "inscrito" | "participados" | "amigos";

export const ActionTabs = ({
  value,
  onChange,
}: {
  value: ActionTabKey;                   // controlado
  onChange: (tab: ActionTabKey) => void; // obrigatório
}) => {
  const active = value ?? "participados";

  const TABS: { key: ActionTabKey; label: string }[] = [
    { key: "inscrito", label: "Inscrito" },
    { key: "participados", label: "Participados" },
    { key: "amigos", label: "Amigos" },
  ];

  const baseBtn = "h-[34px] flex-1 rounded-lg items-center justify-center shadow";
  const inactiveBtn = "border border-black/50 bg-[#F7F8F8]";
  const activeBtn = "bg-[#43A047]";
  const inactiveText = "text-[#292D32] text-[14px] font-medium";
  const activeText = "text-white text-[14px] font-medium";

  return (
    <View className="px-7 mt-6 flex-row gap-3">
      {TABS.map(({ key, label }) => {
        const isActive = key === active;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            className={`${baseBtn} ${isActive ? activeBtn : inactiveBtn}`}
            android_ripple={{ color: "#00000022" }}
          >
            <Text className={isActive ? activeText : inactiveText}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};
