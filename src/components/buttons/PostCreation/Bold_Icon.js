import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const Bold_icon = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_507_1463)">
      <Path
        d="M5.83325 4.16666H10.8333C11.6068 4.16666 12.3487 4.47395 12.8956 5.02093C13.4426 5.56791 13.7499 6.30978 13.7499 7.08332C13.7499 7.85687 13.4426 8.59874 12.8956 9.14572C12.3487 9.6927 11.6068 9.99999 10.8333 9.99999H5.83325V4.16666Z"
        stroke="#999999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.8333 10H11.6666C12.4401 10 13.182 10.3073 13.729 10.8543C14.276 11.4013 14.5833 12.1431 14.5833 12.9167C14.5833 13.6902 14.276 14.4321 13.729 14.9791C13.182 15.526 12.4401 15.8333 11.6666 15.8333H5.83325V10"
        stroke="#999999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_507_1463">
        <Rect width={20} height={20} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default Bold_icon;
