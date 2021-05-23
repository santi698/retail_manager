import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const customTheme = extendTheme(
  {
    colors: {
      brand: {
        10: "#fdfdff",
        20: "#fcfcff",
        50: "#f7f6ff",
        100: "#eeeeff",
        200: "#dddcff",
        300: "#bbb9ff",
        400: "#9997ff",
        500: "#7774ff",
        600: "#5551ff",
        700: "#4441cc",
        800: "#333199",
        900: "#222066",
      },
      gray: {
        50: "#f9f9fb",
        100: "#ededf1",
        200: "#e0e0e7",
        300: "#d2d2dc",
        400: "#c3c3d0",
        500: "#b2b1c3",
        600: "#9f9eb4",
        700: "#88879a",
        800: "#6b6b7a",
        900: "#3f3e47",
      },
      blue: {
        50: "#f5faff",
        100: "#e0efff",
        200: "#cae4ff",
        300: "#b1d7ff",
        400: "#95c8ff",
        500: "#75b7ff",
        600: "#50a3fc",
        700: "#458cd8",
        800: "#366fab",
        900: "#204164",
      },
      cyan: {
        50: "#e4ffff",
        100: "#9efdff",
        200: "#4ff7fa",
        300: "#4ae8ea",
        400: "#45d7da",
        500: "#3fc5c7",
        600: "#38b0b2",
        700: "#309799",
        800: "#267779",
        900: "#164647",
      },
      red: {
        50: "#fff8f8",
        100: "#ffe8e8",
        200: "#ffd7d7",
        300: "#ffc5c4",
        400: "#ffafae",
        500: "#ff9594",
        600: "#ff7472",
        700: "#f2504d",
        800: "#bf3f3d",
        900: "#712524",
      },
      green: {
        50: "#eaffea",
        100: "#b7ffb8",
        200: "#61ff64",
        300: "#4df14f",
        400: "#47e04a",
        500: "#41cd43",
        600: "#3ab73c",
        700: "#329d34",
        800: "#277c29",
        900: "#174918",
      },
    },
    fonts: {
      body: "'Nunito Sans', sans-serif",
      heading: "'Raleway', sans-serif",
      mono: "source-code-pro, Menlo, monospace",
    },
    styles: {
      global: (props) => ({
        body: {
          color: mode("gray.900", "whiteAlpha.900")(props),
        },
      }),
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);

export default customTheme;
