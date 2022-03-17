import { PaletteOptions } from "@mui/material";

export const palette = (colorMode: "light" | "dark"): PaletteOptions => {
  return colorMode === "light"
    ? {
        mode: "light",
        primary: {
          main: "#1a8f88",
        },
        secondary: {
          main: "#ae0000b2",
        },
      }
    : {
        mode: "dark",
        primary: {
          main: "#0fd4c9",
        },
        secondary: {
          main: "#cfcfcf",
        },
      };
};
