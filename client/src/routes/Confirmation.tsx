import Topbar from "../components/Topbar";
import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Container, Link, Stack } from "@mui/material";
import Address from "../components/Address";
import { flexbox } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const steps = [
  "Carrinho",
  "Identificação",
  "Endereço de entrega",
  "Confirmação",
];

function Confirmation() {
  const navigate = useNavigate();
  const authContext = React.useContext(AuthContext);
  const [activeStep, setActiveStep] = React.useState(1);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return step === 2;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = (step: number) => {
    step === 1 && navigate("/cart");
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("Erro. Você precisa concluir todas as etapas.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(1);
  };

  return (
    <Stack gap={5}>
      <Topbar />
      <Container>
        <Box>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption">Opcional</Typography>
                );
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Stack gap={2} direction={"column"} alignItems="center" p={2}>
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  minHeight={"300px"}
                  variant="h6"
                >
                  Tudo certo, sua compra foi concluída com sucesso!
                </Typography>

                <Button variant="contained" onClick={handleReset}>
                  Voltar a loja
                </Button>
              </Stack>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {activeStep === 1 || activeStep === 2 ? (
                <>
                  <Box mt={3}>
                    {activeStep === 2 ? (
                      <Address />
                    ) : (
                      <>
                        {authContext.isAuth ? (
                          <Stack mt={6} gap={2} alignItems="center">
                            <Typography variant="h6">
                              Você está autenticado
                            </Typography>
                            <Typography variant="h6">
                              Clique em avançar para
                              prosseguir com a compra
                            </Typography>
                          </Stack>
                        ) : (
                          <Stack gap={2} alignItems={"center"}>
                            <Typography mb={2} variant="h6">
                              Você já possui um cadastro na TEM DE TUDO?
                            </Typography>
                            <Link href="/login">
                              <Button variant="contained">Faça Login</Button>
                            </Link>
                            <Typography>ou</Typography>
                            <Link
                              href="
                            /register"
                              underline="none"
                            >
                              <Button variant="outlined">Registre-se</Button>
                            </Link>
                          </Stack>
                        )}
                      </>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Button
                      color="inherit"
                      onClick={() => {
                        handleBack(activeStep);
                      }}
                      sx={{ mr: 1 }}
                    >
                      {activeStep === 1 ? "Voltar ao carrinho" : "Voltar"}
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    {isStepOptional(activeStep) && (
                      <Button
                        color="inherit"
                        onClick={handleSkip}
                        sx={{ mr: 1 }}
                      >
                        Buscar na loja
                      </Button>
                    )}
                    <Button disabled={!authContext.isAuth} onClick={handleNext}>
                      Avançar
                    </Button>
                  </Box>
                </>
              ) : (
                <Stack p={3} gap={2} alignItems={"center"}>
                  <Box>
                    <Typography variant="h6">Conferir pedido</Typography>
                  </Box>
                  <Stack>Pedido</Stack>
                  <Stack
                    direction={"row"}
                    justifyContent="space-evenly"
                    width={"100%"}
                  >
                    <Button
                      color="inherit"
                      onClick={() => {
                        handleBack(activeStep);
                      }}
                      sx={{ mr: 1 }}
                    >
                      Voltar para endereço
                    </Button>
                    <Button onClick={handleNext}>Finalizar compra</Button>
                  </Stack>
                </Stack>
              )}
            </React.Fragment>
          )}
        </Box>
      </Container>
    </Stack>
  );
}

export default Confirmation;
