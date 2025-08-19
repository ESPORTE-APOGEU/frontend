import React, { useRef, useState, useEffect } from 'react';
import { View, Animated, Pressable, PanResponder } from 'react-native';
interface SwitcherProps {
    defaultValue?: boolean;
    value?: boolean; // Nova prop para valor controlado
    onValueChange?: (value: boolean) => void;
}

export default function Switcher({ defaultValue, value, onValueChange }: SwitcherProps) {
    // Se value for fornecido, usa ele (componente controlado), senão usa estado interno
    const isControlled = value !== undefined;
    const [isEnabled, setIsEnabled] = useState(defaultValue || false);
    const currentValue = isControlled ? value : isEnabled;
    const translateX = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_: any, gestureState: any) => {
                let x = Math.max(0, Math.min(20, gestureState.dx));
                translateX.setValue(x);
            },
            onPanResponderRelease: (_: any, gestureState: any) => {
                if (gestureState.dx > 10) {
                    Animated.spring(translateX, { toValue: 20, useNativeDriver: false }).start();
                    setIsEnabled(true);
                } else {
                    Animated.spring(translateX, { toValue: 0, useNativeDriver: false }).start();
                    setIsEnabled(false);
                }
            },
        })
    ).current;

    // Efeito para sincronizar value prop externo com estado interno (somente para componente controlado)
    useEffect(() => {
        if (isControlled && value !== undefined) {
            setIsEnabled(value);
        }
    }, [value, isControlled]);

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: currentValue ? 20 : 0,
            useNativeDriver: false,
        }).start();
    }, [currentValue]);
    
    const toggleSwitch = () => {
        const newValue = !currentValue;
        // Só atualiza estado interno se não for controlado
        if (!isControlled) {
            setIsEnabled(newValue);
        }
        onValueChange?.(newValue);
    };

    return (
        <Pressable
            onPress={toggleSwitch}
            className="w-12 h-6 p-0.5 border-2 border-[#10CF65] rounded-full flex-row items-center"
        >
            <Animated.View
                {...panResponder.panHandlers}
                className={`w-4 h-4 rounded-full ${currentValue ? 'bg-[#10CF65]' : 'bg-[#ccc]'}`}
                style={{
                    transform: [{ translateX }],
                }}
            />
        </Pressable>
    );
}
