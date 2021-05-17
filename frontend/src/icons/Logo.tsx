import { SVGAttributes } from "react";

export interface LogoProps
  extends Omit<SVGAttributes<SVGSVGElement>, "height"> {
  size?: number;
}

export function Logo({ size = 48, ...rest }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 133 133"
      {...rest}
    >
      <path fill="#fff" d="M0 0h133v133H0z" />
      <path fill="#5551FF" d="M20.882 20.882h90.353v45.176H20.882z" />
      <path fill="#16C8BE" d="M20.882 67.941h56.471v43.294H20.882z" />
      <path fill="#FF8577" d="M79.235 67.941h32v43.294h-32z" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M19 115V19h96v96H19zm90.667-50.667v-40H24.333v40h85.334zm0 45.334v-40H80.333v40h29.334zm-34.667 0v-40H24.333v40H75z"
        fill="#000"
      />
    </svg>
  );
}
