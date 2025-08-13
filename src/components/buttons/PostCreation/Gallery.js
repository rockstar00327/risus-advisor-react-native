import * as React from "react";
import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg";
const Gallery = (props) => (
  <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <G clipPath="url(#clip0_507_1473)">
      <Path
        d="M12.5 6.66666H12.5083"
        stroke="#999999"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.5 5C2.5 4.33696 2.76339 3.70107 3.23223 3.23223C3.70107 2.76339 4.33696 2.5 5 2.5H15C15.663 2.5 16.2989 2.76339 16.7678 3.23223C17.2366 3.70107 17.5 4.33696 17.5 5V15C17.5 15.663 17.2366 16.2989 16.7678 16.7678C16.2989 17.2366 15.663 17.5 15 17.5H5C4.33696 17.5 3.70107 17.2366 3.23223 16.7678C2.76339 16.2989 2.5 15.663 2.5 15V5Z"
        stroke="#999999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.5 13.3333L6.66667 9.16668C7.44 8.42251 8.39333 8.42251 9.16667 9.16668L13.3333 13.3333"
        stroke="#999999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.6667 11.6667L12.5001 10.8333C13.2734 10.0892 14.2267 10.0892 15.0001 10.8333L17.5001 13.3333"
        stroke="#999999"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_507_1473">
        <Rect width={20} height={20} fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default Gallery;
