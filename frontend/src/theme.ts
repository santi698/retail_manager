import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

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
    },
    fonts: {
      body: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      heading:
        "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      mono: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" })
);

export default customTheme;
