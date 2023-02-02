import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Box, Button, Link } from "@mui/material";
import { useContext } from "react";
import { CartContext, TCartProduct } from "../../context/CartContext";

function productIsInLocalStorage(name: string) {
  try {
    const localItems: TCartProduct[] = JSON.parse(localStorage.getItem('cart') || '[]')
    const productsInCart = localItems.map(product => product.name);
    return productsInCart.includes(name)
  } catch {
    return false
  }
}

export default function ProductCard({ item }: { item: any }) {
  const cartContext = useContext(CartContext)
  return (
    <Card sx={{ mb: 5, mt: 3, maxWidth: 345, height: "530px" }}>
      <Link underline="none" color="inherit" href="/">
        <CardHeader title={item.name} subheader={item.subCategory} />
      </Link>
      <CardMedia
        component="img"
        height="310"
        // width="000"
        src={`data:image/png;base64,${item.images[0]}`}
        alt={`Foto de um ${item.name}`}
      />
      <Link underline="none" color="inherit" href="/">
        <CardContent>
          <Box height={"30px"}>
            <Typography variant="body2" color="text.secondary">
              {item.description}
            </Typography>
          </Box>
        </CardContent>
      </Link>
      <CardActions disableSpacing>
        <Box flex={1} display="flex" justifyContent={"space-evenly"}>
          <Typography variant="h6" color={'white'} sx={{p: 2, bgcolor: '#00000050'}} right={"30px"} bottom={"200px"} position={"absolute"}>
            R$ {item.price}
          </Typography>
          <IconButton aria-label="adicionar ao carrinho">
            <FavoriteIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              cartContext.addItemsToLocalStorage(item.name)
            }}
            aria-label="adicionar ao carrinho"
          >
            <ShoppingCartIcon color={productIsInLocalStorage(item.name) ? 'success' : 'inherit'} />
          </IconButton>

          <Button
            onClick={() => {
              console.log(item.name);
            }}
            color="inherit"
            sx={{ width: "180px" }}
          >
            COMPRAR
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}
