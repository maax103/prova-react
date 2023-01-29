import { ThemeOptions } from "@mui/material";
import { createTheme,  } from "@mui/material";

const default_theme = createTheme({})
export const LightTheme : ThemeOptions = {
  palette: {
    ...default_theme.palette,
    mode: 'light',    
  }
};

export const DarkTheme : ThemeOptions = {
  palette: {
    mode: 'dark',
  }
};
