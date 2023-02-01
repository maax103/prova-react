import Carousel from "react-material-ui-carousel";
import {
  Paper,
  Button,
  Typography,
  Box,
  Link,
  CardMedia,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { CarouselProps } from "react-material-ui-carousel/dist/components/types";
import { IProductsRandom } from "../routes/Home";
import React from "react";
import { bgcolor, border, Stack } from "@mui/system";

interface props {
  items: {
    name: string;
    description: string;
  }[];
}

type TProduct = {
  name: string;
  category: string;
  images: string[];
  price: number;
  seller: string;
  subCategory: string;
  description?: string;
};

const carouselProps: CarouselProps = {
  animation: "fade",
  duration: 400,
  // onChange={((now,prev)=>{console.log(now)})}
  // prev={(noew, prev)=>{console.log(prev)}}
  //   IndicatorIcon={<HomeIcon />} // Previous Example
  height: "400px",
  indicatorContainerProps: {
    style: {
      marginTop: "30px", // 5
      textAlign: "right", // 4
    },
  },
};

export function TopCarousel({ seller }: { seller: IProductsRandom }) {
  const mediaGreaterThan700px = useMediaQuery("(min-width: 700px)");
  const theme = useTheme();
  return seller ? (
    <>
      <Box borderRadius={2} display={'inline-block'} p={1} bgcolor={theme.palette.mode === 'dark' ? theme.palette.success.light : theme.palette.success.light}>
        <Typography color={theme.palette.mode === 'dark' ? 'black' : 'white'} fontSize={mediaGreaterThan700px ? 20 : 16} variant="h5">
          Vendido por {seller.seller.toLocaleUpperCase()}
        </Typography>
      </Box>
      <Carousel {...carouselProps} stopAutoPlayOnHover>
        {seller.products.map((item, i) => (
          <Card key={item.seller} item={item} />
        ))}
      </Carousel>
    </>
  ) : (
    <></>
  );
}

function Card({ item }: { item: TProduct; key: string }) {
  return (
    <Box
      onClick={() => {
        console.log(item.name);
      }}
      sx={{ height: "100%" }}
    >
      <Stack height="100%">
        <h2>{item.name}</h2>
        <Box height={"80%"}>
          <CardMedia
            component="img"
            sx={{ overflow: "hidden" }}
            src={`data:image/png;base64,${item.images[0]}`}
          />
        </Box>
        <Box
          borderLeft="none"
          right={"5px"}
          position={"relative"}
          width={"300px"}
          p={3}
          top="-110px"
          borderRight="0px solid"
          borderRadius={2}
          bgcolor={"#00000088"}
        >
          <Typography component={"p"} color={"white"}>
            <strong>Por apenas R$ {item.price}!</strong>
          </Typography>
          <Typography component={"p"} color={"white"}>
            ou 10x de R$ {item.price / 10}!
          </Typography>
        </Box>
      </Stack>

      {/* <Button className="CheckButton">Oi</Button> */}
    </Box>
  );
}
