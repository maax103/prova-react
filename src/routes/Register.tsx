import {
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Topbar from "../components/Topbar";

function Register() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    formState,
    getValues,
  } = useForm();
  const onSubmit = (data: any) => console.log(data);
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
          sx={{ padding: "2rem", width: 500, minHeight: 500 }}
        >
          <div>
            <Typography variant="h5" m={1} textAlign="center" flex={1}>
              Registrar nova conta
            </Typography>
            <Typography mb={3} flex={1} textAlign="center">
              Insira seus dados abaixo
            </Typography>
            <form
              onSubmit={handleSubmit((data) => {
                console.log(data);
              })}
            >
              <Stack spacing={1} display="flex" alignItems="center">
                <TextField
                  {...register("name", {
                    required: true,
                    maxLength: 50,
                    pattern: /^[a-zA-Z\sáéóúíãõâü]*$/i,
                  })}
                  autoFocus
                  variant="outlined"
                  aria-label={errors.name ? "true" : "false"}
                  label="Nome"
                  sx={{ width: "80%" }}
                  error={errors.name && true}
                />
                {errors.name?.type === "required" && (
                  <p role="alert">Nome é obrigatório</p>
                )}
                {errors.name?.type === "pattern" && (
                  <p role="alert">Nome inválido</p>
                )}
                <TextField
                  {...register("email", {
                    required: true,
                    pattern: /^[a-zA-Z0-9]*@[a-zA-Z]*\.[a-zA-Z]*$/i,
                  })}
                  type={"email"}
                  variant="outlined"
                  label="E-mail"
                  sx={{ width: "80%" }}
                  error={errors.email && true}
                />
                {errors.email?.type === "required" && (
                  <p role="alert">E-mail é obrigatório</p>
                )}
                {errors.email?.type === "pattern" && (
                  <p role="alert">E-mail inválido</p>
                )}

                <TextField
                  {...register("user", {
                    required: true,
                  })}
                  variant="outlined"
                  label="Login"
                  sx={{ width: "80%" }}
                  error={errors.user && true}
                />
                {errors.user?.type === "required" && (
                  <p role="alert">Usuário é obrigatório</p>
                )}
                <TextField
                  {...register("pass", {
                    required: true,
                    min: 6,
                  })}
                  type="password"
                  variant="outlined"
                  label="Senha"
                  sx={{ width: "80%" }}
                  error={errors.pass && true}
                />
                {errors.pass?.type === "required" && (
                  <p role="alert">Senha é obrigatório</p>
                )}
                <TextField
                  {...register("confirmation", {
                    required: true,
                    validate: (value, formState) => {
                      return formState.pass === value;
                    },
                  })}
                  type="password"
                  variant="outlined"
                  label="Confirmar senha"
                  sx={{ width: "80%" }}
                  error={errors.confirmation && true}
                  required={false}
                />
                {errors.confirmation?.type === "validate" && (
                  <p role="alert">Confirmação de senha não confere</p>
                )}
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
                    Registrar
                  </Button>
                  <Link mt={"1rem"} underline="none" href="/login">
                    Já possui uma conta?
                  </Link>
                </Box>
              </Stack>
            </form>
          </div>
          <div>
            <Link
              href="/"
              underline="none"
              mt={6}
              // flex={1}
              display="flex"
              flexDirection="column"
              textAlign="center"
              color="inherit"
            >
              Voltar ao inicio
            </Link>
          </div>
        </Paper>
      </Container>
    </>
  );
}

export default Register;
