import * as React from "react";
import Svg, { Rect, G, Path, Defs, ClipPath } from "react-native-svg";
const BinanceSvg = (props) => (
  <Svg
    width={60}
    height={60}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={60} height={60} rx={9} fill="#F0B90B" />
    <G clipPath="url(#clip0_202_1558)">
      <Path
        d="M20.136 30L16.104 34.032L12 30L16.104 25.896L20.136 30ZM30 20.136L36.984 27.12L41.088 23.016L30 12L18.984 23.016L23.088 27.12L30 20.136ZM43.896 25.896L39.864 30L43.968 34.104L48 30L43.896 25.896ZM30 39.864L23.016 32.88L18.912 36.984L30 48L41.016 36.984L36.984 32.88L30 39.864ZM30 34.032L34.104 29.928L30 25.896L25.896 30L30 34.032Z"
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_202_1558">
        <Rect
          width={36}
          height={36}
          fill="white"
          transform="translate(12 12)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default BinanceSvg;
