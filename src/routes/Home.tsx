import Topbar from "../components/Topbar"
import Container from '@mui/material/Container'
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { Box, Button, Switch } from "@mui/material"
import { ThemeContext } from "../context/ThemeContext"

function Home() {
  const authContext = useContext(AuthContext)
  const darkMode = useContext(ThemeContext)
  return (
    <>
      <Topbar />
      <Container sx={{minHeight: 'calc(100vh - 64px)'}}>
        <Box >
          {String(authContext.isAuth)}
          <Button variant="contained" onClick={() => {
            // console.log(authContext)
            authContext.login()
          }}>
            Login
          </Button>
          <Button variant="contained" onClick={() => { authContext.logout() }}>
            Logout
          </Button>
          <Switch inputProps={{ 'aria-label': 'controlled' }} checked={darkMode.isDarkMode} onChange={darkMode.toggleDarkMode} />
        </Box>
      </Container>
    </>
  )
}

export default Home
