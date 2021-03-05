import React from "react";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

export enum ColorVariant {
  Purple,
  Green,
  Yellow,
  Red,
  Blue,
  Teal,
  Cyan,
  Pink,
  Gray,
}

function colorVariantToString(variant: ColorVariant): string {
  switch (variant) {
    case ColorVariant.Purple: {
      return "purple";
    }
    case ColorVariant.Green: {
      return "green";
    }
    case ColorVariant.Yellow: {
      return "yellow";
    }
    case ColorVariant.Teal: {
      return "teal";
    }
    case ColorVariant.Cyan: {
      return "cyan";
    }
    case ColorVariant.Red: {
      return "red";
    }
    case ColorVariant.Blue: {
      return "blue";
    }
    case ColorVariant.Pink: {
      return "pink";
    }
    case ColorVariant.Gray: {
      return "gray";
    }
  }
}

declare module "styled-components" {
  export interface DefaultTheme {
    background: string;
    color: string;
  }
}

export interface StatusBadgeOption {
  value: string;
  label: string;
}
export interface StatusBadgeProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onChange: (e: React.MouseEvent<HTMLButtonElement>) => void;
  colorVariant: ColorVariant;
  options: StatusBadgeOption[];
  value: string;
}

export function StatusBadge({
  colorVariant,
  options,
  value,
  onChange,
  ...rest
}: StatusBadgeProps) {
  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            isActive={isOpen}
            colorScheme={colorVariantToString(colorVariant)}
            disabled={options.length === 0}
            as={Button}
            rightIcon={<ChevronDownIcon />}
            {...rest}
          >
            {value}
          </MenuButton>
          <MenuList>
            {options.map(({ value, label }) => (
              <MenuItem onClick={(e) => onChange(e)} key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </MenuList>
        </>
      )}
    </Menu>
  );
}
