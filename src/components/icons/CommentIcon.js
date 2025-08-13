import React from "react";
import Svg, { Path } from "react-native-svg";

const CommentIcon = () => {
  return (
    <Svg
      width={16}
      height={16}
      fill="none"
      viewBox="0 0 15 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M7.52976 0.589966C4.07977 0.589966 1.25977 3.01997 1.25977 6.04997C1.25977 7.78997 2.18977 9.34997 3.65977 10.34L2.24977 12.5C2.18977 12.56 2.27977 12.65 2.33977 12.62C3.74977 12.44 5.00976 12.02 6.08976 11.33C6.53976 11.42 7.01976 11.48 7.52976 11.48C10.9798 11.48 13.7998 9.04997 13.7998 6.01997C13.7998 2.98997 11.0098 0.589966 7.52976 0.589966Z"
        stroke="#97D3FF"
        stroke-miterlimit="10"
        stroke-linecap="round"
      />
    </Svg>
  );
};

export default CommentIcon;
