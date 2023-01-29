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
import { Badge, Link } from "@mui/material";
import { SwitchTheme } from "./generics/SwitchTheme";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useTheme } from "@mui/material/styles";

export default function Topbar() {
  const authContext = useContext(AuthContext);
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            e-Commerce
          </Typography>
          {authContext.isAuth ? (
            <div>
              {authContext.isSeller && <>
                <Link underline="none" href="/produtos/cadastrar" p={2} mr={2} color="inherit">
                  <strong>Meus produtos</strong>
                </Link>
              </>}
              <SwitchTheme sx={{ mr: 3 }} />
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={1} color='success' sx={{height: '25px'}} >
                  <Link href="/cart" color='inherit'>
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
                  }}
                >
                  Sair
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Box display="flex" flexDirection="row">
              <Box display='flex' alignItems='center' >
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