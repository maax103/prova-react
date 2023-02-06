import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { CssBaseline } from '@mui/material'
import { AuthContextProvider } from './context/AuthContext'
import { ThemeContextProvider } from './context/ThemeContext'
import { CartContextProvider } from './context/CartContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <AuthContextProvider>
        <CartContextProvider>
          <>
            <CssBaseline />
            <RouterProvider router={router} />
          </>
        </CartContextProvider>
      </AuthContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>
)
