import { ButtonHTMLAttributes, MouseEvent } from "react";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { OrderStatus } from "../../customer_orders/OrderStatus";

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
      return "teal";
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
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  onChange?: (e: MouseEvent<HTMLButtonElement>) => void;
  value: OrderStatus;
}

export function StatusBadge({ value, onChange, ...rest }: StatusBadgeProps) {
  const colorVariant = value.colorVariant();
  const options = value.validTransitions().map((status) => ({
    value: status.value,
    label: status.label(),
  }));

  if (!onChange || options.length === 0) {
    return (
      <Button as="div" colorScheme={colorVariantToString(colorVariant)}>
        {value.label()}
      </Button>
    );
  }

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton
            isActive={isOpen}
            colorScheme={colorVariantToString(colorVariant)}
            as={Button}
            rightIcon={<ChevronDownIcon />}
            {...rest}
          >
            {value.label()}
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
