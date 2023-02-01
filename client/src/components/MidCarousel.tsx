import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

// import required modules
import { A11y, Grid, Navigation, Pagination, Scrollbar } from "swiper";
import { IProductsRandom } from "../routes/Home";
import { Box, Paper } from "@mui/material";
import { height } from "@mui/system";
import ProductCard from "./generics/ProductCard";
import useMediaQuery from "@mui/material/useMediaQuery";

const slideProps = {};

export default function MidCarousel({ products }: any) {
  const mediaGreaterThan700px = useMediaQuery("(min-width: 700px)");
  const mediaGreaterThan450px = useMediaQuery("(min-width: 450px)");
  return products.length ? (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={10}
      slidesPerView={mediaGreaterThan700px ? 3 : mediaGreaterThan450px ? 2 : 1}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      //   onSwiper={(swiper) => console.log(swiper)}
      //   onSlideChange={() => console.log("slide change")}
    >
      {/* <Box display={`flex`} flexDirection={'row'}> */}
      {products.map((elem) =>
        elem.products.map((product) => {
          return (
            <SwiperSlide key={product.name}>
              <ProductCard item={product} />
            </SwiperSlide>
          );
        })
      )}
      {/* </Box> */}
    </Swiper>
  ) : (
    <></>
  );
}
