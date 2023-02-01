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
import { grey } from "@mui/material/colors";

export default function ProductCard({ item }: { item: any }) {
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
              console.log(item.name);
            }}
            aria-label="adicionar ao carrinho"
          >
            <ShoppingCartIcon />
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
