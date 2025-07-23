import { Pressable, Text, View , ActivityIndicator} from "react-native";

interface LargeButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  loading?: boolean;
}
export default function LargeButton({ onPress, title, disabled, loading }: LargeButtonProps) {
  return (
    <View className="w-full items-center">
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        className={`w-[80%] h-16 bg-[#40B843] rounded-lg items-center justify-center shadow-md ${disabled ? 'opacity-50' : ''}`}
        style={{     
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 6 }, // direita e baixo
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 12, // pro Android
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" size={"large"} />
        ) : (
          <Text className="text-white text-lg font-bold">{title}</Text>
        )}
      </Pressable>
    </View>
  );
}