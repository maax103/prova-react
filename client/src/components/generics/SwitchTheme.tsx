import { IconButton, styled } from "@mui/material";
import { Switch } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { IconButtonProps } from "@mui/material/IconButton";

export function SwitchTheme(props : IconButtonProps ) {

    const theme = useContext(ThemeContext)

  return (
    <IconButton color="inherit" onClick={theme.toggleDarkMode} {...props} >
        {theme.isDarkMode ? <DarkModeIcon /> : <WbSunnyIcon />}
    </IconButton>
  )
}
