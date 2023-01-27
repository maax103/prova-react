import { useLayoutEffect, useMemo, useState } from "react"
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles'
import { createContext } from "react"
import { DarkTheme, LightTheme } from "./Themes"

export const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => { }
})

export function ThemeContextProvider({ children }: { children: JSX.Element }) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const darkMode = useMemo(() => ({
    isDarkMode: isDarkMode,
    toggleDarkMode: () => {
      isDarkMode ? localStorage.setItem('dark-mode', 'false') : localStorage.setItem('dark-mode', 'true')
      setIsDarkMode(!isDarkMode)
    }
  }), [isDarkMode])

  useLayoutEffect(() => {
    const preference = localStorage.getItem('dark-mode')
    if (preference === 'true') {
      setIsDarkMode(true)
    } else {
      setIsDarkMode(false)
      localStorage.setItem('dark-mode', 'false')
    }
  }, [])

  const defaultTheme = createTheme()
  const lightTheme = useMemo(
    () => createTheme(Object.assign(defaultTheme, LightTheme)),
    [isDarkMode],
  );

  const darkTheme = useMemo(
    () => createTheme(Object.assign(defaultTheme, DarkTheme)),
    [isDarkMode],
  );

  return (
    <ThemeContext.Provider value={darkMode}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}