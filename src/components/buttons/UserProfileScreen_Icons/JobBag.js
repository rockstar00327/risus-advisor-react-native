import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const JobBag = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_452_2115)">
      <Path
        d="M2.5 7.50001C2.5 7.05798 2.67559 6.63406 2.98816 6.3215C3.30072 6.00894 3.72464 5.83334 4.16667 5.83334H15.8333C16.2754 5.83334 16.6993 6.00894 17.0118 6.3215C17.3244 6.63406 17.5 7.05798 17.5 7.50001V15C17.5 15.442 17.3244 15.866 17.0118 16.1785C16.6993 16.4911 16.2754 16.6667 15.8333 16.6667H4.16667C3.72464 16.6667 3.30072 16.4911 2.98816 16.1785C2.67559 15.866 2.5 15.442 2.5 15V7.50001Z"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.66663 5.83333V4.16667C6.66663 3.72464 6.84222 3.30072 7.15478 2.98816C7.46734 2.67559 7.89127 2.5 8.33329 2.5H11.6666C12.1087 2.5 12.5326 2.67559 12.8451 2.98816C13.1577 3.30072 13.3333 3.72464 13.3333 4.16667V5.83333"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 10V10.0083"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.5 10.8333C4.82632 12.0056 7.39502 12.6162 10 12.6162C12.605 12.6162 15.1737 12.0056 17.5 10.8333"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_452_2115">
        <Rect width={20} height={20} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default JobBag;
