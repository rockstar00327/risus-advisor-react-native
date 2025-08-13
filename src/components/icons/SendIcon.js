import React from "react";
import Svg, { G, Path } from "react-native-svg";

const SendIcon = () => {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="#97D3FF"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G>
        <Path fill="none" d="M0 0h24v24H0z" />
        <Path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" />
      </G>
    </Svg>
  );
};

export default SendIcon;
