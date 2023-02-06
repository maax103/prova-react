import Topbar from "../components/Topbar";
import Container from "@mui/material/Container";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Box } from "@mui/material";
import { ThemeContext } from "../context/ThemeContext";
import { fetchServer } from "../utils/serverUtils";
import { GET_RANDOM_PRODUCTS_URL } from "../utils/urls";
import { TopCarousel } from "../components/TopCarousel";
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
  const [products, setProducts] = useState<IProductsRandom[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetchServer(GET_RANDOM_PRODUCTS_URL, {
        amount: 20,
      });
      const randomProducts = await response.json();
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
