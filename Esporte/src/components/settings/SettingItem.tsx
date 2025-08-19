import { View, Text, Pressable } from 'react-native';

import Switcher from '@/src/components/ui/Forms/Switcher';
interface SettingItemProps {
    title: string;
    icon: React.ReactNode;
    onPress: () => void;
    switcherTitle?: string;
    switcherDescription?: string;
    switcherValue?: boolean;
    onSwitcherValueChange?: (value: boolean) => void;
    }


export default function SettingItem({ title, onPress, icon, switcherTitle, switcherDescription, switcherValue, onSwitcherValueChange }: SettingItemProps) {
    return (
        <View
            className="my-2"
            style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 8, // Para Android
            backgroundColor: '#fff', // Necessário para sombra aparecer no iOS
            borderRadius: 8,
            }}
        >
            <View
                className="relative"
                style={{
                    height: switcherTitle ? 118 : 62,
                }}
            >
                {/* Bottom layer - green */}
                <View
                    className="absolute top-1 left-0 right-0 bg-[#43A047] rounded-xl z-0"
                    style={{
                        height: switcherTitle ? 118 : 62,
                    }}
                />
                {/* Top layer - white */}
                <View
                    className="absolute top-0 left-0 right-0 bg-white rounded-xl flex-col justify-center z-10"
                    style={{
                        height: switcherTitle ? 118 : 62, // Dynamic height
                    }}
                >
                    <Pressable
                        className="py-2 px-3 flex-row items-center justify-between bg-transparent"
                        onPress={onPress}
                    >
                        {icon}
                        <Text className="ml-2 text-xl">{title}</Text>
                    </Pressable>
                    {switcherTitle && (
                        <Pressable
                            className="py-4 flex-row items-center justify-between px-3 bg-transparent"
                            onPress={onPress}
                        >
                            <View className="max-w-[80%]">
                                <Text className="font-medium text-lg">{switcherTitle}</Text>
                                <Text className="font-extralight">{switcherDescription}</Text>
                            </View>
                            <Switcher value={switcherValue} onValueChange={onSwitcherValueChange} />
                        </Pressable>
                    )}
                </View>
            </View>
        </View>
    );
}