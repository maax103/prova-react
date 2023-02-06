import { Box, Paper, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ConfirmationCard({ getValues }) {
  const cartContext = useContext(CartContext);
  const cartInfo = cartContext.getLocalStorageItems();
  return (
    <Paper elevation={1} sx={{ padding: 4 }}>
      <Stack gap={2}>
        <Box display={"flex"} justifyContent="center">
          <Typography variant="h6">Confirme os dados abaixo do pedido</Typography>
        </Box>
        <Stack p={3} gap={1} display={"flex"} justifyContent="center">

          {cartInfo.map(product => {

            return <React.Fragment key={product.name}>
              <Stack direction="row" alignItems={"center"}>
                <Typography flex={1}>{product.name}</Typography>
                <Typography variant="h6">{product.amount}</Typography>
              </Stack>
            </React.Fragment>
          })}

          <Typography mt={4}>
            Endereço de entrega:
          </Typography>

          {getValues("logradouro") ?
            <>
              <Typography>
                {getValues("logradouro") + ", " + getValues("complemento")}
              </Typography>
              <Typography>
                {getValues("cidade") + " - " + getValues("uf")}
              </Typography>
            </>
            : "Buscar na loja"}

        </Stack>

      </Stack>
    </Paper>
  );
}

export default ConfirmationCard;
