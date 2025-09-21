import { ImageSourcePropType } from "react-native";

export type SliderType = {
    date: String;
    image: ImageSourcePropType;
}

export const SliderInfo = [
    {
        date: "23 de Março",
        image: require("../assets/images/rosto.png"),
    },
    {
        date: "18 de Outubro",
        image: require("../assets/images/jovem-com-iphone.png"),
    }
    ]

export default SliderInfo;