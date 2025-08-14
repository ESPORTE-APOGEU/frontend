import React, { useState } from "react";
import { View, Text, Pressable, Dimensions, Alert } from "react-native";
import { Svg, Path } from "react-native-svg";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS 
} from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text1, Text2, Text3, Text4 } from "../components/Preview/AllTexts";
import { Img1 } from "../components/Preview/Img1";
import { Img2 } from "../components/Preview/Img2";
import { Img3 } from "../components/Preview/Img3";
import { Img4 } from "../components/Preview/Img4";


const { width: screenWidth } = Dimensions.get('window');

export default function Preview() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const translateX = useSharedValue(0);
    const opacity = useSharedValue(1);

    // Arrays com todos os componentes (4 de cada) - descomente quando criar os outros
    const imageComponents = [Img1, Img2, Img3, Img4]; // Temporário até você criar Img3 e Img4
    const textComponents = [Text1, Text2, Text3, Text4]; // Temporário até você criar Text3 e Text4
    const totalSlides = 4;

    const animateSlide = (direction: 'left' | 'right') => {
        const slideDistance = direction === 'left' ? -screenWidth : screenWidth;
        
        // Primeira fase: deslizar para fora
        translateX.value = withTiming(slideDistance, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 });
        
        // Segunda fase: trocar componente e deslizar para dentro
        setTimeout(() => {
            let newIndex;
            if (direction === 'left') {
                newIndex = (currentIndex + 1) % totalSlides;
            } else {
                newIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            }
            
            runOnJS(setCurrentIndex)(newIndex);
            
            // Posicionar do lado oposto
            translateX.value = direction === 'left' ? screenWidth : -screenWidth;
            
            // Animar entrada
            translateX.value = withTiming(0, { duration: 300 });
            opacity.value = withTiming(1, { duration: 300 });
        }, 300);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        opacity: opacity.value,
    }));

    const CurrentImage = imageComponents[currentIndex];
    const CurrentText = textComponents[currentIndex];
    const nextSlide = () => {
        if (currentIndex < totalSlides - 1) {
            animateSlide('left');
        } else {
            Alert.alert("Fim da apresentação", "Você chegou ao último slide.");
        }
    };
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View className="flex-1">
                {currentIndex >= 1 ? (
                <View className="bg-[#F7FFED] w-full h-[8%] flex flex-row justify-between items-end px-4">

                    <Svg onPress={() => animateSlide('right')} width="10" height="21" viewBox="0 0 10 21" fill="none">
                        <Path d="M8 2L2 10.5L8 19" stroke="#43A047" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </Svg>

                    <Text className="text-[#43A047] text-2xl font-normal">Pular</Text>

                </View>): <View className="bg-[#F7FFED] w-full h-[8%]" />}
                
                {/* Seção da Imagem com Animação */}
                <View className="bg-[#F7FFED] w-full h-[30%] flex justify-center items-center">
                    <Animated.View style={animatedStyle}>
                        <CurrentImage />
                    </Animated.View>
                </View>
                
                <View className="flex-1">
                    <SvgComponent preserveAspectRatio="xMidYMid slice" className="bg-[#F7FFED]"/>
                </View>
                
                {/* Seção do Texto com Animação */}
                <View className="w-full h-[30%] flex justify-center items-center text-center">
                    <Animated.View style={animatedStyle}>
                        <CurrentText />
                    </Animated.View>
                </View>
                
                <View className="bg-[#43A047] w-full h-[30%] flex justify-center items-center">
                    <View className="flex-col items-center gap-4">
                        {/* Indicadores de página - só aparecem do slide 2 ao 4 */}
                        <Animated.View 
                            style={useAnimatedStyle(() => ({
                                opacity: currentIndex >= 1 ? withTiming(1, { duration: 300 }) : withTiming(0, { duration: 300 }),
                                transform: [{ scale: currentIndex >= 1 ? withTiming(1, { duration: 300 }) : withTiming(0.8, { duration: 300 }) }]
                            }))}
                        >
                            {currentIndex >= 1 ? (
                                <View className="flex-row gap-2">
                                    {Array.from({ length: totalSlides - 1 }).map((_, index) => (
                                        <View
                                            key={index}
                                            className={`w-2 h-2 rounded-full ${
                                                index + 1 === currentIndex ? 'bg-[#F7FFED]' : 'bg-[#F7FFED]/40'
                                            }`}
                                        />
                                    ))}
                                </View>
                            ) : (
                                <View className="flex-row gap-4" />
                            )}
                        </Animated.View>
                        
                        {/* Botão central para avançar */}
                        <Pressable 
                            className="bg-[#F7FFED] rounded-[50%] p-4 flex justify-center items-center"
                            onPress={nextSlide}
                        >
                            <Svg width="36" height="36" viewBox="0 0 11 21" fill="none">
                                <Path d="M2.5 2L8.5 10.5L2.5 19" stroke="#43A047" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            </Svg>
                        </Pressable>
                    </View>
                </View>
            </View>
        </GestureHandlerRootView>
    );
}
function SvgComponent(props: any) {
    return(
        <Svg width="430" height="576" viewBox="0 0 430 576" fill="none" {...props}>
            <Path d="M-114.657 154.843C-109.025 121.324 -93.1182 90.3829 -69.1359 66.2981L-58.0433 55.158C-8.40533 5.30793 67.4966 -7.33165 130.61 23.7424L150.903 33.7334C160.624 38.5195 170.795 42.3305 181.268 45.1104L237.138 59.9409C274.525 69.8651 314.216 66.2548 349.199 49.7478L440.831 6.51067C464.215 -4.52373 491.831 -1.37012 512.126 14.6523L515.309 17.1648C516.434 18.0531 517.476 19.0419 518.422 20.1189L535.613 39.6899C541.348 46.2189 552.073 43.4179 553.884 34.9185C556.572 22.2953 538.601 16.7898 533.757 28.7529L522.301 57.0506C521.138 59.9253 521.02 63.1174 521.969 66.07L617.173 362.324C651.193 468.187 572.231 576.5 461.037 576.5H8.35262C-93.0764 576.5 -170.186 485.354 -153.381 385.327L-114.657 154.843Z" fill="#43A047"/>
        </Svg>
    );
}

