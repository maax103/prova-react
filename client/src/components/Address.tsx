import { Box, Paper, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import Topbar from "./Topbar";

function Address() {
  const mediaGreaterThan700px = useMediaQuery("(min-width: 700px)")
  return (
    <Paper elevation={1} sx={{ padding: 2 }}>
      <Stack gap={2}>
        <Box display={"flex"} justifyContent="center">
          <Typography variant="h6">Informe seus dados para entrega</Typography>
        </Box>
        <Stack gap={1} component={"form"}>
          <Stack direction={mediaGreaterThan700px ? "row" : "column"} gap={1}>
            
            <TextField label="Rua" fullWidth></TextField>
            <TextField fullWidth></TextField>
          </Stack>
          <Stack direction={mediaGreaterThan700px ? "row" : "column"} gap={1}>
            <TextField fullWidth></TextField>
            <TextField fullWidth></TextField>
          </Stack>
          <Stack></Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default Address;
