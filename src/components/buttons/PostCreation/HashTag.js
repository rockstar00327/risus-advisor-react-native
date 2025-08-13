import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const HashTag = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_507_1457)">
      <Path
        d="M4.16675 7.5H15.8334"
        stroke="#999999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M4.16675 12.5H15.8334"
        stroke="#999999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.16659 3.33334L5.83325 16.6667"
        stroke="#999999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.1666 3.33334L10.8333 16.6667"
        stroke="#999999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_507_1457">
        <Rect width={20} height={20} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default HashTag;
