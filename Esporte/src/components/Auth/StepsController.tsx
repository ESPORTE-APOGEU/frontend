import React, { useEffect } from "react";
import { View, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import StepForm1 from "./StepForm1";
import StepForm2 from "./StepForm2";
import StepForm3 from "./StepForm3";
import { SignupForm } from "@/interfaces/SigupForm";

interface StepsSignupProps {
  step: number;
  onNext?: () => void;
  form: SignupForm;
  setForm: React.Dispatch<React.SetStateAction<SignupForm>>;
}

export default function StepsSignup({
  step,
  onNext,
  form,
  setForm,
}: StepsSignupProps) {
  const { width } = useWindowDimensions();
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(-(step - 1) * width, { duration: 300 });
  }, [step, width]); // <- re-calcula ao mudar a largura

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="flex-1 overflow-hidden">
      <Animated.View
        style={[
          { width: width * 3, flexDirection: "row", flex: 1 }, // <- flex:1
          animatedStyle,
        ]}
      >
        <View style={{ width, flex: 1 }}>
          <StepForm1 onNext={onNext} form={form} setForm={setForm} />
        </View>
        <View style={{ width, flex: 1 }}>
          <StepForm2 onNext={onNext} form={form} setForm={setForm} />
        </View>
        <View style={{ width, flex: 1 }}>
          <StepForm3 form={form} setForm={setForm} />
        </View>
      </Animated.View>
    </View>
  );
}
