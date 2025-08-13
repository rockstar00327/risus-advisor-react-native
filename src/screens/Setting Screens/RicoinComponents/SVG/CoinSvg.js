import * as React from "react";
import Svg, { G, Rect, Circle, Path } from "react-native-svg";

const CoinSvg = (props) => (
  <Svg width={50} height={50} viewBox="0 0 50 50" fill="none" {...props}>
    <G>
      {/* Simulated shadow */}
      <Circle
        cx={22}
        cy={23}
        r={15.3847}
        fill="#000"
        opacity={0.2}
      />
      
      {/* Background and content */}
      <Rect x={1} y={1} width={40} height={40} rx={20} fill="#FFF16B" />
      <Circle cx={21} cy={21} r={15.3847} fill="#FFD400" />
      <Path
        d="M15.5 28H11.3L13.62 14.8H19.52C24.08 14.8 24.84 17.18 24.46 19.38C24.08 21.5 23.12 23.18 21.08 23.8L20.94 23.84L22.5 28H17.84L16.4 23.84H16.22L15.5 28ZM17.18 18.4L16.82 20.42H18.52C19.46 20.42 20.1 20.2 20.26 19.38C20.4 18.54 19.8 18.4 18.86 18.4H17.18ZM27.3414 17.58C26.2814 17.58 25.3614 17 25.5214 16.08C25.6814 15.14 26.8214 14.58 27.8814 14.58C28.9414 14.58 29.8814 15.14 29.7214 16.08C29.5614 17 28.4014 17.58 27.3414 17.58ZM27.6214 28H23.4214L25.2014 17.86H29.4014L27.6214 28Z"
        fill="#FFF592"
      />
    </G>
  </Svg>
);

export default CoinSvg;
