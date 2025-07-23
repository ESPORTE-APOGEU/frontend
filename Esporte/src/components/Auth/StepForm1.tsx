import React from 'react';
import { View, Text, Pressable } from "react-native";
import LargeButton from "../ui/Forms/LargeButtom";
interface StepsSignupProps {
  onNext?: () => void;
}
export default function StepForm1({ onNext }: StepsSignupProps) {
    const handleNext = () => {
      if (onNext) {
        onNext();
      }
    };
  return (
    <View>
      <Text>Step 1</Text>
      <LargeButton onPress={handleNext}  title="Next" />
    </View>
  );
}
