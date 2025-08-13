import * as React from "react";
import Svg, { Rect, Defs, LinearGradient, Stop } from "react-native-svg";

function Hook({ width = 38, height = 10, ...props }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Rect
        x={1}
        y={1}
        width={width - 2}
        height={height - 2}
        rx={4}
        stroke="url(#paint0_linear_83_1262)"
        strokeWidth={2}
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_83_1262"
          x1={2}
          y1={5}
          x2={36}
          y2={5}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#8FB9C9" />
          <Stop offset={1} stopColor="#10100E" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default Hook;
