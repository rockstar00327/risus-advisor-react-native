import * as React from "react";
import Svg, {
  G,
  Rect,
  Circle,
  Ellipse,
  Defs,
  ClipPath,
} from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: filter */
const BalanceBgSvg = (props) => (
  <Svg
    width={421}
    height={242}
    viewBox="0 0 421 242"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G filter="url(#filter0_dddiiiii_72_1886)">
      <G clipPath="url(#clip0_72_1886)">
        <Rect
          x={30}
          y={20}
          width={361}
          height={182}
          rx={24}
          fill="white"
          fillOpacity={0.01}
          shapeRendering="crispEdges"
        />
        <G filter="url(#filter1_n_72_1886)">
          <Rect
            x={31}
            y={20}
            width={360}
            height={182}
            fill="white"
            fillOpacity={0.04}
          />
        </G>
        <G filter="url(#filter2_f_72_1886)">
          <Circle cx={323.495} cy={100} r={64} fill="#A07DFF" />
        </G>
        <G filter="url(#filter3_f_72_1886)">
          <Circle cx={206.426} cy={91.4261} r={34.4261} fill="#90889F" />
        </G>
        <G filter="url(#filter4_f_72_1886)">
          <Circle cx={252.426} cy={134.426} r={34.4261} fill="#2B5FE2" />
        </G>
        <G filter="url(#filter5_f_72_1886)">
          <Circle cx={182.5} cy={161.5} r={49.5} fill="#91EFB7" />
        </G>
        <G filter="url(#filter6_f_72_1886)">
          <Ellipse cx={73.5} cy={133} rx={39.5} ry={39} fill="#FFBF00" />
        </G>
      </G>
    </G>
    <Defs>
      <ClipPath id="clip0_72_1886">
        <Rect x={30} y={20} width={361} height={182} rx={24} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default BalanceBgSvg;
