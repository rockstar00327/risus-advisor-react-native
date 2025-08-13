import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const Edit_icon = (props) => (
  <Svg
    width={21}
    height={21}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_444_306)">
      <Path
        d="M5.83337 5.83334H5.00004C4.55801 5.83334 4.13409 6.00894 3.82153 6.3215C3.50897 6.63406 3.33337 7.05798 3.33337 7.50001V15C3.33337 15.442 3.50897 15.866 3.82153 16.1785C4.13409 16.4911 4.55801 16.6667 5.00004 16.6667H12.5C12.9421 16.6667 13.366 16.4911 13.6786 16.1785C13.9911 15.866 14.1667 15.442 14.1667 15V14.1667"
        stroke="black"
        strokeOpacity={0.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.9875 5.4875C17.3157 5.15929 17.5001 4.71415 17.5001 4.25C17.5001 3.78585 17.3157 3.3407 16.9875 3.0125C16.6593 2.68429 16.2142 2.49991 15.75 2.49991C15.2858 2.49991 14.8407 2.68429 14.5125 3.0125L7.5 10V12.5H10L16.9875 5.4875Z"
        stroke="black"
        strokeOpacity={0.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.3334 4.16666L15.8334 6.66666"
        stroke="black"
        strokeOpacity={0.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_444_306">
        <Rect width={20} height={20} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default Edit_icon;
