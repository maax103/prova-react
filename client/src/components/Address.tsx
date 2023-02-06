import { Box, Button, IconButton, InputAdornment, MenuItem, OutlinedInput, Paper, Stack, TextField, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { Controller } from "react-hook-form";
import InputMask from "react-input-mask"
import { ufOpts } from "../utils/utils";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from '@mui/material/CircularProgress';

function Address({ handleNext, register, handleSubmit, setValue, getValues, control, watch, setFocus, errors, clearErrors  }) {
  
  const theme = useTheme()
  const mediaGreaterThan700px = useMediaQuery("(min-width: 700px)")
  const [loadingCEP, setLoadingCEP] = useState(false);
  function handleSubmitAddress(data) {
    alert(JSON.stringify(data))
    handleNext()
  }
  async function handleGetCEPData() {
    setLoadingCEP(true);
    const data = getValues()
    try {
      const URL = `https://viacep.com.br/ws/${data.cep.replace("-", "")}/json/`
      const response = await fetch(URL);
      if (response.status !== 200) return
      const { logradouro, complemento, bairro, localidade, uf } = await response.json();

      setValue('cidade', localidade)
      setValue('bairro', bairro)
      setValue('logradouro', logradouro)
      setValue('complemento', complemento)
      setLoadingCEP(false)
      // setValue('uf', uf)
      setFocus("uf")
      clearErrors()
    } catch {
      setLoadingCEP(false)
    }
  }
  return (
    <Paper elevation={1} sx={{ padding: 2 }}>
      <Stack gap={2}>
        <Box display={"flex"} justifyContent="center">
          <Typography variant="h6">Informe seus dados para entrega</Typography>
        </Box>
        <Stack gap={1} component={"form"} onSubmit={handleSubmit(handleSubmitAddress)}>
          <Stack direction={mediaGreaterThan700px ? "row" : "column"} gap={1}>
            <Stack width="100%">
              <Controller
                name="cep"
                control={control}
                rules={{
                  required: true
                }}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <InputMask mask="99999-999" value={value} onChange={onChange}>
                    {
                      inputProps => (
                        <Tooltip
                          title="Busque seu endereço com o CEP">
                          <OutlinedInput
                            // id="cep"
                            fullWidth
                            sx={{ height: '56px' }}
                            error={errors.cep && true}
                            // autoFocus
                            startAdornment={

                              !loadingCEP ? <InputAdornment sx={{ mr: 2 }} position="start">
                                <IconButton
                                  onClick={handleGetCEPData}
                                  edge="end"
                                >
                                  <SearchIcon />
                                </IconButton>
                              </InputAdornment>
                                : <CircularProgress sx={{ mr: 2 }} />}
                            {...inputProps}
                            placeholder="CEP"
                          />
                        </Tooltip>
                      )
                    }
                  </InputMask>
                )}
              />
              {errors.cep && <Typography margin={"3px 0 0 14px"} fontSize={"0.75rem"} color={theme.palette.error.main}>Campo obrigatório</Typography>}
            </Stack>
            <TextField
              {...register("cidade", {
                required: true
              })}
              label="Cidade"
              fullWidth
              error={errors.cidade && true}
              helperText={errors.cidade && "Campo obrigatório"}
              InputLabelProps={{ shrink: !!watch("cidade") }}
            />
            <TextField
              {...register("bairro", { required: true })}
              fullWidth
              label="Bairro"
              InputLabelProps={{ shrink: !!watch("bairro") }}
              error={errors.bairro && true}
              helperText={errors.bairro && "Campo obrigatório"}
            />
            <TextField
              fullWidth
              label="UF"
              defaultValue={""}
              select
              inputProps={register("uf")}
              InputLabelProps={{ shrink: !!watch("uf") }}
            >
              {ufOpts.map(value =>
                <MenuItem key={value} value={value}>{value}</MenuItem>
              )}
            </TextField>
          </Stack>
          <Stack direction={mediaGreaterThan700px ? "row" : "column"} gap={1}>
            <TextField
              {...register("logradouro")}
              fullWidth
              label="Logradouro"
              InputLabelProps={{ shrink: !!watch("logradouro") }}
            />
            <TextField
              {...register("complemento")}
              fullWidth
              label="Complemento"
              InputLabelProps={{ shrink: !!watch("complemento") }}
            />
            <Controller
              name="telefone"
              control={control}
              render={({ field: { onChange, value, ref } }) =>
                <InputMask mask="(99) 99999-9999" value={value} onChange={onChange}>
                  {
                    inputProps => (
                      <TextField
                        fullWidth
                        label="Telefone"
                        sx={{ height: '56px' }}
                        inputProps={register("telefone",
                          { pattern: /^\([0-9]{2}\)\s[0-9]{5}\-[0-9]{4}/g || "" })}
                        error={errors.telefone && true}
                        helperText={errors.telefone && "Valor inválido"}
                        {...inputProps}
                      />
                    )
                  }
                </InputMask>
              }
            />
          </Stack>
          <Button type="submit" sx={{ mt: 2 }}>
            Confirmo que os dados acima estão corretos
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default Address;
