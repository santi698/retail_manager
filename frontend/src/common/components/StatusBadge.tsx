import React from "react";
import { Tag, TagProps } from "@chakra-ui/react";

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
  [ColorVariant.Purple]: "purple",
  [ColorVariant.Green]: "green",
  [ColorVariant.Yellow]: "yellow",
  [ColorVariant.Red]: "red",
  [ColorVariant.Blue]: "blue",
};

export function StatusBadge({
  colorVariant,
  children,
  ...rest
}: {
  colorVariant: ColorVariant;
  children: React.ReactNode;
} & TagProps) {
  return (
    <Tag colorScheme={colorThemes[colorVariant]} {...rest}>
      {children}
    </Tag>
  );
}
