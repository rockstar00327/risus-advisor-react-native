import * as React from "react";
import Svg, { Path } from "react-native-svg";
const RemainingSvg = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M7 12C7 13.657 9.686 15 13 15C16.314 15 19 13.657 19 12M7 12C7 10.343 9.686 9 13 9C16.314 9 19 10.343 19 12M7 12V16C7 17.656 9.686 19 13 19C16.314 19 19 17.656 19 16V12M1 4C1 5.072 2.144 6.062 4 6.598C5.856 7.134 8.144 7.134 10 6.598C11.856 6.062 13 5.072 13 4C13 2.928 11.856 1.938 10 1.402C8.144 0.866 5.856 0.866 4 1.402C2.144 1.938 1 2.928 1 4ZM1 4V14C1 14.888 3 16.5 4.5 16.5M1 9C1 9.888 3 11.5 4.5 11.5"
      stroke="black"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default RemainingSvg;
