import { Button, Container, Divider, Paper, Stack, Typography } from "@mui/material"
import React, { useContext, useEffect, useState } from "react"
import Topbar from "../components/Topbar"
import { CartContext, TCartProduct } from "../context/CartContext"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Footer } from "../components/Footer";
import { fetchServer } from "../utils/serverUtils";
import { GET_PRODUCTS_URL } from "../utils/urls";

function Cart() {
  const cartContext = useContext(CartContext);
  const [products, setProducts] = useState<TCartProduct[]>([])
  useEffect(() => {
    const localInfos = cartContext.getLocalStorageItems()
    const getProductsInfo = async () => {
      const data = fetchServer(GET_PRODUCTS_URL,)
    }
    setProducts(localInfos)


  }, [])

  return (
    <>
      <Topbar />
      <Container>
        <Paper sx={{ mt: 3, mb: 3, p: 3 }}>
          <Stack gap={3}>
            <Typography variant="h6">
              Revise seu carrinho
            </Typography>
            <Divider />

            {products.map(product => (
              <React.Fragment key={product.name}>
                <Typography >
                  Produto:{product.name} | Quantidade: {product.amount}
                </Typography>
                <Typography >
                  Total: {product.amount * 100}
                </Typography>
              </React.Fragment>
            ))}
            <Stack gap={1} mt={2} justifyContent='space-around' direction='row'>
              <Button variant="outlined" >
                Limpar carrinho
              </Button>
              <Button endIcon={<ArrowForwardIcon />}
                variant="contained" >
                Continuar para a compra
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
      <Footer />
    </>
  )
}

export default Cart
