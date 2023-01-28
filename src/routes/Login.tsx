import {
  Button,
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import Topbar from "../components/Topbar";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { useTheme } from "@mui/material/styles";
function Login() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);
  const [isValidLogin, setIsValidLogin] = useState<boolean | null>(null);
  const theme = useTheme();
  return (
    <>
      <Container
        sx={{
          marginTop: "0.5rem",
          minHeight: "calc(100vh - 1rem)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "2rem",
            width: 500,
            height: 500,
          }}
        >
          <div>
            <Typography variant="h5" m={1} textAlign="center" flex={1}>
              Fazer login
            </Typography>
            <Typography mb={3} flex={1} textAlign="center">
              Use sua conta do eCommerce
            </Typography>
            <form
              onSubmit={handleSubmit((data) => {
                console.log(data);
              })}
            >
              <Stack spacing={1} display="flex" alignItems="center">
                <TextField
                  {...register("user", {
                    required: true,
                  })}
                  variant="outlined"
                  label="Login"
                  sx={{ width: "80%" }}
                  autoFocus
                ></TextField>
                <TextField
                  {...register("pass", {
                    required: true,
                  })}
                  type="password"
                  variant="outlined"
                  label="Senha"
                  sx={{ width: "80%" }}
                ></TextField>
                <Box
                  width={"80%"}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                >
                  <Button
                    sx={{ mt: "2rem" }}
                    fullWidth
                    type="submit"
                    variant="contained"
                    onClick={() => {
                      handleSubmit(onSubmit);
                    }}
                  >
                    entrar
                  </Button>
                  <Link mt={"1rem"} underline="none" href="/register">
                    Não possui uma conta?
                  </Link>
                </Box>
              </Stack>
            </form>
          </div>
          <div>
            <Link
              href="/"
              underline="none"
              mb={3}
              // flex={1}
              display="flex"
              flexDirection="column"
              textAlign="center"
              color="inherit"
            >
              Voltar ao inicio
            </Link>

            {isValidLogin === false && (
              <Typography
                // mb={3}
                flex={1}
                display="flex"
                flexDirection="column"
                textAlign="center"
                color={theme.palette.error.main}
              >
                Credenciais inválidas!
              </Typography>
            )}
          </div>
        </Paper>
      </Container>
    </>
  );
}

export default Login;
