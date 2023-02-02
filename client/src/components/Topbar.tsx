import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Badge, Link, useMediaQuery } from "@mui/material";
import { SwitchTheme } from "./generics/SwitchTheme";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { CartContext } from "../context/CartContext";

export default function Topbar() {
  const mediaGreaterThan450px = useMediaQuery("(min-width: 500px)");
  const authContext = useContext(AuthContext);
  const cartContext = useContext(CartContext);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ height: 64, flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Link
              href="/"
              display="inline-block"
              color={"inherit"}
              underline="none"
            >
              {mediaGreaterThan450px ? (
                <Typography variant={"h6"} component="div">
                  TEM DE TUDO
                </Typography>
              ) : (
                <HomeIcon />
              )}
            </Link>
          </Box>
          {authContext.isAuth ? (
            <div>
              {authContext.isSeller && (
                <>
                  <Link
                    underline="none"
                    href="/products"
                    p={2}
                    mr={2}
                    color="inherit"
                  >
                    <strong>
                      {mediaGreaterThan450px ? "Meus Produtos" : "Produtos"}
                    </strong>
                  </Link>
                </>
              )}
              <SwitchTheme sx={{ mr: 3 }} />
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={cartContext.count} color="success" sx={{ height: "25px" }}>
                  <Link href="/cart" color="inherit">
                    <ShoppingCartIcon />
                  </Link>
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Meu cadastro</MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    authContext.logout();
                    navigate("/");
                  }}
                >
                  Sair
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Box display="flex" flexDirection="row">
              <Box display="flex" alignItems="center">
                <SwitchTheme sx={{ mr: 3 }} />
              </Box>
              <Link underline="none" href="/login" p={2} mr={2} color="inherit">
                <strong>Login</strong>
              </Link>
              <Link
                underline="none"
                href="/register"
                p={2}
                mr={2}
                color="inherit"
              >
                <strong>Registrar</strong>
              </Link>
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
