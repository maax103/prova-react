import { Box, Button, CardMedia, Container, Divider, Grid, IconButton, Link, Paper, Stack, Typography } from "@mui/material"
import React, { useContext, useEffect, useState } from "react"
import Topbar from "../components/Topbar"
import { CartContext, TCartProduct } from "../context/CartContext"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Footer } from "../components/Footer";
import { fetchServer } from "../utils/serverUtils";
import { GET_PRODUCTS_BY_NAME_URL } from "../utils/urls";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

type TProduct = {
  seller: string,
  product: string,
  images: string[],
  amountAtCart: number,
  category: string,
  createdAt: string,
  description: string,
  name: string,
  price: number,
  subCategory: string,
  updateAt: string
}

function Cart() {
  const navigate = useNavigate()
  const cartContext = useContext(CartContext);
  const [products, setProducts] = useState<TProduct[]>([])
  function handleAddItem(productName: string) {
    const newArray = products.map(item =>
      item.name === productName ? { ...item, amountAtCart: item.amountAtCart + 1 } : item
    )
    setProducts(newArray);
    cartContext.addItemsToLocalStorage(productName);
  }
  function handleRemoveItem() {
  }
  useEffect(() => {
    const localInfos = cartContext.getLocalStorageItems()
    console.log(localInfos)
    const getProductsInfo = async () => {
      const cartNames = localInfos.map(product => product.name);
      const response = await fetchServer(GET_PRODUCTS_BY_NAME_URL, {
        names: cartNames
      })
      if (response.status !== 200) throw new Error();
      const db_infos = await response.json();
      const cart_infos = db_infos.map(item => {
        let aux = { ...item };
        localInfos.forEach(localStorageItem => {
          if (localStorageItem.name = item.name) {
            aux = { ...aux, amountAtCart: localStorageItem.amount }
            delete aux.amount;
          }
        })
        return aux;
      })
      setProducts(cart_infos);
    }
    try {
      getProductsInfo()
    } catch {
      alert("Falha ao carregar produtos do carrinho.")
      localStorage.setItem('cart', '');
      navigate("/")
    }


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

                <Stack gap={2} direction='row' >
                  <Box display="flex" alignItems='center' height={'100px'}>
                    <Link href='/'>
                      <CardMedia
                        sx={{ borderRadius: 2, height: '100px', width: '100px' }}
                        component='img'
                        src={`data:image/png;base64,${product.images[0]}`}
                        alt={`Foto de ${product.name}`}
                      />
                    </Link>
                  </Box>
                  <Grid display='flex' alignItems={'center'} height={'100px'} container>
                    <Grid item xs={10}>
                      <Typography >
                        {product.name}: R$ {product.price}
                      </Typography>
                    </Grid>
                    <Grid display='flex' justifyContent={'flex-end'} item xs={2}>
                      <Typography >
                        Total: {product.amountAtCart * 100}
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <Stack gap={1} direction='row' alignItems='center' >
                        <IconButton >
                          <RemoveIcon />
                        </IconButton>
                        <Typography variant='h6' component='p' >
                          {product.amountAtCart}
                        </Typography>
                        <IconButton onClick={() => { handleAddItem(product.name) }} >
                          <AddIcon />
                        </IconButton>
                      </Stack>
                    </Grid>
                    <Grid display='flex' alignItems={'center'} justifyContent={'flex-end'} item xs={2}>
                      <IconButton >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Stack>

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
