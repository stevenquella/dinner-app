import { Shadows, ThemeOptions } from "@mui/material";

export const themeOptions: ThemeOptions = {
  shape: {
    borderRadius: 0,
  },
  shadows: Array(25).fill("none") as Shadows,
  palette: {
    mode: "light",
    primary: {
      main: "#00471B",
    },
    secondary: {
      main: "#0077C0",
    },
    warning: {
      main: "#A16C00",
    },
    error: {
      main: "#AC1A2F",
    },
    info: {
      main: "#EEE1C6",
    },
    background: {
      default: "#f5f5f5",
      paper: "#fefefe",
    },
  },
};
