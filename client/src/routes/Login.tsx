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
import { LOGIN_URL } from "../utils/urls";
import { fetchServer } from "../utils/serverUtils";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
function Login() {
  const auth = useContext(AuthContext);
  const cartContext = useContext(CartContext);
  const navigate = useNavigate();
  const [isValidLogin, setIsValidLogin] = useState<boolean | null>(null);
  const [serverError, setServerError] = useState<boolean | null>(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    try {
      const response = await fetchServer(
        LOGIN_URL,
        { method: "POST" },
        { user: data.user, pass: data.pass }
      );
      const {
        isValid,
        token,
        type,
      }: { isValid: boolean; token: string; type: string } =
        await response.json();
      if (isValid) {
        auth.makeLogin(token);
        type === "seller" && auth.toggleSeller();
        cartContext.count > 0 ? navigate("/confirmation") : navigate("/");
      } else {
        setIsValidLogin(false);
        setServerError(null);
      }
    } catch (err) {
      setServerError(false);
      console.log(err);
    }
  };
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={1} display="flex" alignItems="center">
                <TextField
                  {...register("user", {
                    required: true,
                    onChange: () => {
                      setIsValidLogin(null);
                    },
                  })}
                  variant="outlined"
                  label="Login"
                  sx={{ width: "80%" }}
                  autoFocus
                ></TextField>
                <TextField
                  {...register("pass", {
                    required: true,
                    onChange: () => {
                      setIsValidLogin(null);
                    },
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
            {serverError === false && (
              <Typography
                // mb={3}
                flex={1}
                display="flex"
                flexDirection="column"
                textAlign="center"
                color={theme.palette.error.main}
              >
                Ocorreu um erro no servidor. Tente novamente mais tarde.
              </Typography>
            )}
          </div>
        </Paper>
      </Container>
    </>
  );
}

export default Login;
