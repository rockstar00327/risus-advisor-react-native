import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const ItalicIcon = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_507_1467)">
      <Path
        d="M9.16675 4.16666H14.1667"
        stroke="#999999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.83325 15.8333H10.8333"
        stroke="#999999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.6666 4.16666L8.33325 15.8333"
        stroke="#999999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_507_1467">
        <Rect width={20} height={20} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default ItalicIcon;
