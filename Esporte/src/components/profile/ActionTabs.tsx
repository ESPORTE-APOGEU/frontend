// components/profile/ActionTabs.tsx
import React, { useState } from "react";
import { View, Pressable, Text } from "react-native";

export type ActionTabKey = "inscrito" | "participados" | "amigos";

export const ActionTabs = ({
  value,
  defaultValue = "participados",
  onChange,
}: {
  value?: ActionTabKey;
  defaultValue?: ActionTabKey;
  onChange?: (tab: ActionTabKey) => void;
}) => {
  const [internal, setInternal] = useState<ActionTabKey>(defaultValue);
  const active = value ?? internal;

  const TABS: { key: ActionTabKey; label: string }[] = [
    { key: "inscrito", label: "Inscrito" },
    { key: "participados", label: "Participados" },
    { key: "amigos", label: "Amigos" },
  ];

  const baseBtn =
    "h-[34px] flex-1 rounded-lg items-center justify-center shadow";
  const inactiveBtn = "border border-black/50 bg-[#F7F8F8]";
  const activeBtn = "bg-[#10CF65]";
  const inactiveText = "text-[#292D32] text-[14px] font-medium";
  const activeText = "text-white text-[14px] font-medium";

  const handle = (tab: ActionTabKey) => {
    if (value === undefined) setInternal(tab);
    onChange?.(tab);
  };

  return (
    <View className="px-7 mt-6 flex-row gap-3">
      {TABS.map(({ key, label }) => {
        const isActive = key === active;
        return (
          <Pressable
            key={key}
            onPress={() => handle(key)}
            className={`${baseBtn} ${isActive ? activeBtn : inactiveBtn}`}
            android_ripple={{ color: "#00000022" }}
          >
            <Text className={isActive ? activeText : inactiveText}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
