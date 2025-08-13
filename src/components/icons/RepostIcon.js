import React from "react";
import Svg, { Path } from "react-native-svg";

const RepostIcon = () => {
  return (
    <Svg
      width={16}
      height={16}
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M11.3335 0.666626L14.0002 3.33329L11.3335 5.99996"
        stroke="#97D3FF"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M2 7.33337V6.00004C2 5.2928 2.28095 4.61452 2.78105 4.11442C3.28115 3.61433 3.95942 3.33337 4.66667 3.33337H14"
        stroke="#97D3FF"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M4.66667 15.3333L2 12.6667L4.66667 10"
        stroke="#97D3FF"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M14 8.66663V9.99996C14 10.7072 13.719 11.3855 13.219 11.8856C12.7189 12.3857 12.0406 12.6666 11.3333 12.6666H2"
        stroke="#97D3FF"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default RepostIcon;
