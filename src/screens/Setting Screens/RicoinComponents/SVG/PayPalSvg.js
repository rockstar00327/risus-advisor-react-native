import * as React from "react";
import Svg, { Rect, G, Path, Defs, ClipPath } from "react-native-svg";
const PayPalSvg = (props) => (
  <Svg
    width={60}
    height={60}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Rect width={60} height={60} rx={8} fill="#BAD4E5" />
    <G clipPath="url(#clip0_202_1552)">
      <Path
        d="M40.5881 20.28C40.5881 24.7392 36.4565 30 30.2052 30H24.1837L23.8881 31.8576L22.4833 40.8H15L19.5019 12H31.6261C35.7087 12 38.9207 14.2664 40.1038 17.416C40.445 18.3317 40.6093 19.3035 40.5881 20.28Z"
        fill="#002991"
      />
      <Path
        d="M44.9013 28.5605C44.5019 30.9777 43.2518 33.1743 41.3749 34.7573C39.498 36.3404 37.1168 37.2064 34.6574 37.2005H30.4759L28.7354 48.0005H21.2922L22.4834 40.8005L23.889 31.8581L24.1837 30.0005H30.2053C36.4485 30.0005 40.5881 24.7397 40.5881 20.2805C43.6603 21.8597 45.4515 25.0509 44.9013 28.5605Z"
        fill="#60CDFF"
      />
      <Path
        d="M40.5881 20.2807C39.2998 19.6095 37.7376 19.2007 36.0372 19.2007H25.8849L24.1837 30.0007H30.2052C36.4485 30.0007 40.5881 24.7399 40.5881 20.2807Z"
        fill="#008CFF"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_202_1552">
        <Rect
          width={30}
          height={36}
          fill="white"
          transform="translate(15 12)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export default PayPalSvg;
