import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SetaVoltar = (props: any) => (
  <Svg
    width={21}
    height={30}
    viewBox="0 0 21 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M19 2L2 15L19 28"
      stroke="white"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SetaVoltar;
