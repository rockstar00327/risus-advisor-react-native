import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const Comment = (props) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_410_2324)">
      <Path
        d="M3 20L4.3 16.1C1.976 12.663 2.874 8.22803 6.4 5.72603C9.926 3.22503 14.99 3.43003 18.245 6.20603C21.5 8.98303 21.94 13.472 19.274 16.707C16.608 19.942 11.659 20.922 7.7 19L3 20Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_410_2324">
        <Rect width={24} height={24} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default Comment;
