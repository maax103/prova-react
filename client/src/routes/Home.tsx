import Topbar from "../components/Topbar";
import Container from "@mui/material/Container";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Box, Button, Switch } from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";
import { fetchServer, getSellerImagesFromServer } from "../utils/serverUtils";
import { GET_IMAGES_URL, GET_RANDOM_PRODUCTS_URL } from "../utils/urls";
import { TopCarousel } from "../components/TopCarousel";
import ProductCard from "../components/generics/ProductCard";
import { IProducts } from "./Products";
import MidCarousel from "../components/MidCarousel";
import { Footer } from "../components/Footer";

export interface IProductsRandom {
  seller: string;
  products: {
    amount: number;
    category: string;
    images: string[];
    name: string;
    price: number;
    seller: string;
    subCategory: string;
  }[];
}

function Home() {
  const authContext = useContext(AuthContext);
  const darkMode = useContext(ThemeContext);
  const [products, setProducts] = useState<IProductsRandom[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetchServer(GET_RANDOM_PRODUCTS_URL, {
        amount: 20,
      });
      const randomProducts = await response.json();
      console.log(randomProducts);
      // const response = await getSellerImagesFromServer(names, seller, amount);

      // const data = await response.json();

      setProducts(randomProducts);
    };

    getProducts();
  }, []);

  return (
    <>
      <Topbar />
      <Container sx={{ minHeight: "calc(100vh - 64px)" }}>
        {products.length ? (
          <>
            <Box m={3}>
              <TopCarousel seller={products[0]} />
            </Box>
            <MidCarousel products={products} />
            <Box m={3}>
              {/* {products.map(item=>
              item.products.map(product=><ProductCard key={product.name} item={product} />)
            )} */}

              {/* <ProductCard items={products[0].products[0]} /> */}
            </Box>
          </>
        ) : (
          ""
        )}
      </Container>
      <Footer />
    </>
  );
}

export default Home;
