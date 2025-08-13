import * as React from "react";
import Svg, { Rect, Path } from "react-native-svg";
const ThreedotSVG = (props) => (
  <Svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect
      width={32}
      height={32}
      rx={9.14286}
      fill="#000F1A"
      fillOpacity={0.3}
    />
    <Path
      d="M11.5557 16H11.5657M16.0057 16H16.0146M20.4346 16H20.4446"
      stroke="white"
      strokeWidth={2.22222}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 16C6 11.286 6 8.929 7.464 7.464C8.93 6 11.286 6 16 6C20.714 6 23.071 6 24.535 7.464C26 8.93 26 11.286 26 16C26 20.714 26 23.071 24.535 24.535C23.072 26 20.714 26 16 26C11.286 26 8.929 26 7.464 24.535C6 23.072 6 20.714 6 16Z"
      stroke="white"
      strokeWidth={1.66667}
    />
  </Svg>
);
export default ThreedotSVG;
