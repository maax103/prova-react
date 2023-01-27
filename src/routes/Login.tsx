import { Button, Container, Divider, Grid, Link, Paper, Stack, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useNavigate } from "react-router-dom"
import Topbar from "../components/Topbar"
function Login() {

  return (
    <Container sx={{ marginTop: '0.5rem', minHeight: 'calc(100vh - 1rem)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={1} sx={{ padding: '2rem', width: 500, height: 500 }}>
        <Typography variant="h5" m={1} textAlign='center' flex={1}>
          Fazer login
        </Typography>
        <Typography mb={3} flex={1} textAlign='center'>
          Use sua conta do eCommerce
        </Typography>
        <Stack spacing={1} display="flex" alignItems='center'>

          <TextField
            variant="outlined"
            label="Login"
            sx={{ width: "80%" }}
            autoFocus
          >
          </TextField>
          <TextField
            type="password"
            variant="outlined"
            label="Senha"
            sx={{ width: "80%" }}

          >
          </TextField>
          <Box width={"80%"} display='flex' flexDirection="column" alignItems='center'>
            <Button sx={{mt: '2rem'}} fullWidth type="submit" variant="contained" >
              entrar
            </Button>
            <Link mt={'1rem'} underline='none' href="/register">
              Não possui uma conta?
            </Link>
          </Box>
        </Stack>


      </Paper>
    </Container >
  )
}

export default Login
