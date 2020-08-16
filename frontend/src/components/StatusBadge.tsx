import React from "react";
import styled, { ThemeProvider } from "styled-components";

export enum ColorVariant {
  Purple,
  Green,
  Yellow,
  Red,
  Blue,
}

declare module "styled-components" {
  export interface DefaultTheme {
    background: string;
    color: string;
  }
}

const colorThemes = {
  [ColorVariant.Purple]: { background: "#dce1ff", color: "#463fbd" },
  [ColorVariant.Green]: { background: "#cbffe4", color: "#248552" },
  [ColorVariant.Yellow]: { background: "#fff797", color: "black" },
  [ColorVariant.Red]: { background: "#ffc6ba", color: "black" },
  [ColorVariant.Blue]: { background: "#c3f3ff", color: "black" },
};

const Wrapper = styled.div`
  border-radius: 16px;
  height: 24px;
  width: 100px;
  padding: 4px 16px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.color};
`;

export function StatusBadge({
  colorVariant,
  children,
}: {
  colorVariant: ColorVariant;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={colorThemes[colorVariant]}>
      <Wrapper>{children}</Wrapper>
    </ThemeProvider>
  );
}
