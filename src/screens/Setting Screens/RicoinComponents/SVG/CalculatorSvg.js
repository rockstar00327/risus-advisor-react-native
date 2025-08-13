import * as React from "react";
import Svg, { Path } from "react-native-svg";
const CalculatorSvg = (props) => (
  <Svg
    width={18}
    height={22}
    viewBox="0 0 18 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M5 5H13M13 13V17M13 9H13.01M9 9H9.01M5 9H5.01M9 13H9.01M5 13H5.01M9 17H9.01M5 17H5.01M3 1H15C16.1046 1 17 1.89543 17 3V19C17 20.1046 16.1046 21 15 21H3C1.89543 21 1 20.1046 1 19V3C1 1.89543 1.89543 1 3 1Z"
      stroke="black"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default CalculatorSvg;
