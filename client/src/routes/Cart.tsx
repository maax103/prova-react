import {
  Box,
  Button,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import { CartContext, TCartProduct } from "../context/CartContext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Footer } from "../components/Footer";
import { fetchServer } from "../utils/serverUtils";
import { GET_PRODUCTS_BY_NAME_URL } from "../utils/urls";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { formatter } from "../utils/utils";
import { AtmOutlined } from "@mui/icons-material";

type TProduct = {
  seller: string;
  product: string;
  images: string[];
  amountAtCart: number;
  category: string;
  createdAt: string;
  description: string;
  name: string;
  price: number;
  subCategory: string;
  updateAt: string;
};

function Cart() {
  const navigate = useNavigate();
  const mediaGreaterThan700px = useMediaQuery("(min-width: 700px)");
  const cartContext = useContext(CartContext);
  const [products, setProducts] = useState<TProduct[]>([]);
  function handleAddItem(productName: string) {
    const newArray = products.map((item) =>
      item.name === productName
        ? { ...item, amountAtCart: item.amountAtCart + 1 }
        : item
    );
    setProducts(newArray);
    cartContext.addItemsToLocalStorage(productName);
  }
  function handleRemoveItem(productName: string, amountAtCart: number) {
    let newArray = [...products];
    if (amountAtCart === 1) {
      if (newArray.length === 1) {
        newArray = [];
        cartContext.clearLocalStorage();
      } else {
        products.forEach((product, index) => {
          if (product.name === productName) {
            newArray.splice(index, 1);
            cartContext.removeItemsFromLocalStorage(productName);
          }
        });
      }
    } else {
      newArray = products.map((product) => {
        if (product.name === productName) {
          cartContext.removeItemsFromLocalStorage(productName);
          return { ...product, amountAtCart: product.amountAtCart - 1 };
        } else {
          return product;
        }
      });
    }
    setProducts(newArray);
  }
  function handleDeleteItem(productName: string, amount: number) {
    const newArray = products.reduce((acum: TProduct[], product) => {
      if (product.name !== productName) acum.push(product);
      return acum;
    }, []);
    setProducts(newArray);
    for (let i = 0; i < amount; i++)
      cartContext.removeItemsFromLocalStorage(productName);
  }
  function handleResetCart() {
    setProducts([]);
    cartContext.clearLocalStorage();
  }
  useEffect(() => {
    const localInfos = cartContext.getLocalStorageItems();
    const getProductsInfo = async () => {
      const cartNames = localInfos.map((product) => product.name);
      const response = await fetchServer(GET_PRODUCTS_BY_NAME_URL, {
        names: cartNames,
      });
      if (response.status !== 200) throw new Error();
      const db_infos = await response.json();
      const cart_infos = db_infos.map((item) => {
        let aux = { ...item };
        localInfos.forEach((localStorageItem) => {
          if (localStorageItem.name === item.name) {
            aux = { ...aux, amountAtCart: localStorageItem.amount };
            delete aux.amount;
          }
        });
        return aux;
      });
      setProducts(cart_infos);
    };
    try {
      getProductsInfo();
    } catch {
      alert("Falha ao carregar produtos do carrinho.");
      localStorage.setItem("cart", "");
      navigate("/");
    }
  }, []);

  return (
    <>
      <Topbar />
      <Container sx={{ minHeight: "calc(100vh - 145px)" }}>
        <Paper sx={{ mt: 3, mb: 3, p: 3 }}>
          <Stack gap={3}>
            <Typography variant="h6">Revise seu carrinho</Typography>
            <Divider />

            {products.map((product) => (
              <React.Fragment key={product.name}>
                <Stack gap={2} direction="row">
                  <Box display="flex" alignItems="center" height={"100px"}>
                    <Link href="/">
                      <CardMedia
                        sx={{
                          borderRadius: 1,
                          height: "100px",
                          width: "100px",
                        }}
                        component="img"
                        src={`data:image/png;base64,${product.images[0]}`}
                        alt={`Foto de ${product.name}`}
                      />
                    </Link>
                  </Box>
                  <Grid
                    display="flex"
                    alignItems={"center"}
                    height={"100px"}
                    container
                  >
                    <Grid
                      item
                      xs={mediaGreaterThan700px ? 10 : 12}
                      sx={{
                        textAlign: mediaGreaterThan700px ? "left" : "right",
                      }}
                    >
                      <Typography>
                        {product.name}: {formatter.format(product.price)}
                      </Typography>
                    </Grid>
                    <Grid
                      display="flex"
                      justifyContent={"flex-end"}
                      item
                      xs={mediaGreaterThan700px ? 2 : 12}
                    >
                      <Typography>
                        Total:{" "}
                        {formatter.format(product.amountAtCart * product.price)}
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <Stack gap={1} direction={"row"} alignItems="center">
                        <IconButton
                          onClick={() => {
                            handleRemoveItem(
                              product.name,
                              product.amountAtCart
                            );
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography variant="h6" component="p">
                          {product.amountAtCart}
                        </Typography>
                        <IconButton
                          onClick={() => {
                            handleAddItem(product.name);
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </Stack>
                    </Grid>
                    <Grid
                      display="flex"
                      alignItems={"center"}
                      justifyContent={"flex-end"}
                      item
                      xs={2}
                    >
                      <IconButton
                        onClick={() => {
                          handleDeleteItem(product.name, product.amountAtCart);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Stack>
              </React.Fragment>
            ))}
            <Box>
              <Typography
                textAlign={"right"}
                width={"100%"}
                variant="h6"
                component="p"
              >
                {"Total da compra: "}
                {formatter.format(
                  products.reduce(
                    (acum, product) =>
                      acum + product.price * product.amountAtCart,
                    0
                  )
                )}
              </Typography>
            </Box>
            <Stack
              gap={1}
              mt={2}
              justifyContent="space-around"
              direction={mediaGreaterThan700px ? "row" : "column"}
            >
              <Button onClick={handleResetCart} variant="outlined">
                Limpar carrinho
              </Button>
              <Button 
              onClick={()=>{navigate("/confirmation")}}
              disabled={products.length === 0} endIcon={<ArrowForwardIcon />} variant="contained">
                Continuar para a compra
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
      <Footer />
    </>
  );
}

export default Cart;
