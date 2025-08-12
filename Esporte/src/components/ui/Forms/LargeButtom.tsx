import { Pressable, Text, View , ActivityIndicator} from "react-native";

interface LargeButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  loading?: boolean;
  iconRight?: React.ReactNode;
}
export default function LargeButton({ onPress, title, disabled, loading, iconRight }: LargeButtonProps) {
  return (
    <View className="w-full items-center">
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        className={`w-[80%] h-16 bg-[#43A047] rounded-lg items-center justify-center shadow-md ${disabled ? 'opacity-50' : ''}`}
        style={{     
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 6 }, 
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 12,
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" size={"large"} />
        ) : (<View className="flex-row items-center justify-center">
          <Text className={`text-white text-lg font-bold text-center ${iconRight ? 'mr-2' : ''}`}>{title}</Text>
          {iconRight}
        </View>)}
      </Pressable>
    </View>
  );
}