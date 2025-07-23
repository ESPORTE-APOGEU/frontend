import { View, Text, Pressable, Image } from "react-native";
import StepForm1 from "./StepForm1";
interface StepsSignupProps {
  step: number;
  onNext?: () => void;
}

export default function StepsSignup({ step, onNext }: StepsSignupProps) {
  switch (step) {
    case 1:return<StepForm1 onNext={onNext} />;
    case 2:return<><Text>Step 2</Text></>
    case 3:return<><Text>Step 3</Text></>
  }
}