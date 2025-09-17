import Svg, { Path } from 'react-native-svg';


const BackButtonIcon = ({color="#43A047", ...props}) => {
  return (
    <Svg width="10" height="21" viewBox="0 0 10 21" fill="none" {...props}>
        <Path d="M8 2L2 10.5L8 19" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
};

export default BackButtonIcon;
