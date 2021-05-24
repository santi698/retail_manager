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
      viewBox="0 0 64 64"
      {...rest}
    >
      <path fill="#fff" d="M0 0h64v64H0z" />
      <path fill="#5451FF" stroke="#000" strokeWidth="3" d="M5 7h54v25H5z" />
      <path fill="#45D7DA" stroke="#000" strokeWidth="3" d="M5 32h34v25H5z" />
      <path fill="#FF9594" stroke="#000" strokeWidth="3" d="M39 32h20v25H39z" />
    </svg>
  );
}
