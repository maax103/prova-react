import { Box, Divider, Link, Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";

export function Footer() {
  const theme = useTheme();
  return (
    <Box
      component={"footer"}
      display="flex"
      bgcolor={
        theme.palette.mode === "dark"
          ? theme.palette.grey[900]
          : theme.palette.primary.main
      }
      sx={{ border: "none", padding: 3, mt: 7 }}
    >
      <Stack gap={1} flex={1}>
        <Divider />
        <Typography color={'white'} mt={4} fontWeight={500} align="center">
          Projeto de e-commerce em react com integraçao com bando de dados sqlite. Acesse minha pagina do github para mais informações.
        </Typography>
        <Typography color='white' fontWeight={500} align="center">
          Desenvolvido por Maximiliano Matheus Furtado
        </Typography>
        <Typography color='white' mb={4} fontWeight={500} align="center">
          Contato: maximilianomfurtado@gmail.com | Github:{" "}
          <Link href="https://github.com/maax103" color={"inherit"}>
            maax103
          </Link>
        </Typography>
        <Divider />
      </Stack>
    </Box>
  );
}
