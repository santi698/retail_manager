import React from "react";
import { Tag } from "@chakra-ui/core";

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
}: {
  colorVariant: ColorVariant;
  children: React.ReactNode;
}) {
  return <Tag variantColor={colorThemes[colorVariant]}>{children}</Tag>;
}
