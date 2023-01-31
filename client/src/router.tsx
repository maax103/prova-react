import { createBrowserRouter, redirect } from "react-router-dom";
import Cart from "./routes/Cart";
import Check from "./routes/Check";
import Confirmation from "./routes/Confirmation";
import Done from "./routes/Done";
import ErrorPage from "./routes/ErrorPage";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Payment from "./routes/Payment";
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
    path: "/check",
    element: <Check />,
  },
  {
    path: "/payment",
    element: <Payment />,
  },
  {
    path: "/confirmation",
    element: <Confirmation />,
  },
  {
    path: "/done",
    element: <Done />,
  },
  {
    path: "*",
    element: <h1>Página inexistente</h1>,
    errorElement: <ErrorPage />,
  },
]);
