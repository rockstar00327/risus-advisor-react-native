import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const AiMagicButton = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_121_2507)">
      <Path
        d="M5 17.5L17.5 5L15 2.5L2.5 15L5 17.5Z"
        stroke="#0063AC"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.5 5L15 7.5"
        stroke="#0063AC"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.49992 2.5C7.49992 2.94203 7.67551 3.36595 7.98807 3.67851C8.30063 3.99107 8.72456 4.16667 9.16659 4.16667C8.72456 4.16667 8.30063 4.34226 7.98807 4.65482C7.67551 4.96738 7.49992 5.39131 7.49992 5.83333C7.49992 5.39131 7.32432 4.96738 7.01176 4.65482C6.6992 4.34226 6.27528 4.16667 5.83325 4.16667C6.27528 4.16667 6.6992 3.99107 7.01176 3.67851C7.32432 3.36595 7.49992 2.94203 7.49992 2.5Z"
        stroke="#0063AC"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15.8334 10.8333C15.8334 11.2753 16.009 11.6993 16.3216 12.0118C16.6341 12.3244 17.0581 12.5 17.5001 12.5C17.0581 12.5 16.6341 12.6756 16.3216 12.9881C16.009 13.3007 15.8334 13.7246 15.8334 14.1666C15.8334 13.7246 15.6578 13.3007 15.3453 12.9881C15.0327 12.6756 14.6088 12.5 14.1667 12.5C14.6088 12.5 15.0327 12.3244 15.3453 12.0118C15.6578 11.6993 15.8334 11.2753 15.8334 10.8333Z"
        stroke="#0063AC"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_121_2507">
        <Rect width={20} height={20} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default AiMagicButton;
