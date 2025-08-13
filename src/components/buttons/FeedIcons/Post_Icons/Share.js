import * as React from "react";
import Svg, { Path } from "react-native-svg";
const ShareIcon = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M18.9999 1L12.4999 19C12.4561 19.0957 12.3856 19.1769 12.297 19.2338C12.2084 19.2906 12.1053 19.3209 11.9999 19.3209C11.8946 19.3209 11.7915 19.2906 11.7029 19.2338C11.6143 19.1769 11.5438 19.0957 11.4999 19L7.99995 12L0.999948 8.5C0.904207 8.45613 0.823075 8.38569 0.766194 8.29705C0.709314 8.20842 0.679077 8.10532 0.679077 8C0.679077 7.89468 0.709314 7.79158 0.766194 7.70295C0.823075 7.61431 0.904207 7.54387 0.999948 7.5L18.9999 1Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default ShareIcon;
