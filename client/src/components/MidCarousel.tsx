import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import ProductCard from "./generics/ProductCard";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function MidCarousel({ products }: any) {
  const mediaGreaterThan700px = useMediaQuery("(min-width: 700px)");
  const mediaGreaterThan450px = useMediaQuery("(min-width: 450px)");
  return products.length ? (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={10}
      slidesPerView={mediaGreaterThan700px ? 3 : mediaGreaterThan450px ? 2 : 1}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
    >
      {products.map((elem) =>
        elem.products.map((product) => {
          return (
            <SwiperSlide key={product.name}>
              <ProductCard item={product} />
            </SwiperSlide>
          );
        })
      )}
    </Swiper>
  ) : (
    <></>
  );
}
