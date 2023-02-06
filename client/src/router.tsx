import { createBrowserRouter } from "react-router-dom";
import Cart from "./routes/Cart";
import Confirmation from "./routes/Confirmation";
import ErrorPage from "./routes/ErrorPage";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Products from "./routes/Products";
import Register from "./routes/Register";
import Search from "./routes/Search";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/products",
    element: <Products />
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/confirmation",
    element: <Confirmation />,
  },
  {
    path: "*",
    element: <h1>Página inexistente</h1>,
    errorElement: <ErrorPage />,
  },
]);
