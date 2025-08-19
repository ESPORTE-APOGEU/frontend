import { View,Text } from "react-native";
import BackButtonIcon from "../icons/backButtom";
import { router } from "expo-router";
interface HeaderSettingsPageProps {
  title: string;
}
export default function HeaderSettingsPage({ title }: HeaderSettingsPageProps) {
  return (
    <View className="p-4 w-full flex flex-row justify-between items-center px-6 mt-8">
      <BackButtonIcon color="black" onPress={() => {router.back()}} />
      <Text className="text-2xl font-normal">{title}</Text>
        <View className="w-4" /> {/* Placeholder for symmetry */}
    </View>
  );
};