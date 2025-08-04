import { View, Dimensions } from 'react-native';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import StepForm1 from './StepForm1';
import StepForm2 from './StepForm2';
import StepForm3 from './StepForm3';

const { width } = Dimensions.get('window');

interface StepsSignupProps {
  step: number;
  onNext?: () => void;
}

export default function StepsSignup({ step, onNext }: StepsSignupProps) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(-(step - 1) * width, { duration: 300 });
  }, [step]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="flex-1 overflow-hidden justify-center">
      <Animated.View
        style={[
          {
            width: width * 3, // 3 etapas
            flexDirection: 'row',
          },
          animatedStyle,
        ]}
      >
        <View style={{ width }}><StepForm1 onNext={onNext} /></View>
        <View style={{ width }}><StepForm2 onNext={onNext} /></View>
        <View style={{ width }}><StepForm3 onNext={onNext} /></View>
      </Animated.View>
    </View>
  );
}
