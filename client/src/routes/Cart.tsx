import { Container, Divider, Paper, Stack, Typography } from "@mui/material"
import React, { useContext, useEffect, useState } from "react"
import Topbar from "../components/Topbar"
import { CartContext, TCartProduct } from "../context/CartContext"

function Cart() {
  const cartContext = useContext(CartContext);
  const [products, setProducts] = useState<TCartProduct[]>([])
  useEffect(() => {
    const localInfos = cartContext.getLocalStorageItems()
    setProducts(localInfos)
  }, [])

  return (
    <>
      <Topbar />
      <Container>
        <Paper sx={{ mt: 3, p: 3 }}>
          <Stack gap={3}>
            <Typography variant="h6">
              Carrinho
            </Typography>
            <Divider />

            {products.map(product => (
              <React.Fragment key={product.name}>
                <Typography >
                  Produto:{product.name} | Quantidade: {product.amount}
                </Typography>
              </React.Fragment>
            ))}
          </Stack>
        </Paper>
      </Container>
    </>
  )
}

export default Cart
