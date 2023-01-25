import { createBrowserRouter, redirect } from "react-router-dom";
import ErrorPage from "./routes/ErrorPage";
import Home from "./routes/Home";
import Login from "./routes/Login";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />
  },
  {
    path: '/search',
    element: 'search page'
  },
  
  {
    path: '/product',
    element: 'product page'
  },
  
  {
    path: '/cart',
    element: 'cart page'
  },
  {
    path: '/check',
    element: 'check page'
  },
  {
    path: '/payment',
    element: 'payment page'
  },
  {
    path: '/confirmation',
    element: 'confirmation page'
  },
  {
    path: '/done',
    element: 'done page'
  },
  {
    path : '*',
    element: <h1>Página inexistente</h1>,
    errorElement: <ErrorPage />    
  }
]);