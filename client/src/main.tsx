import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import { router } from './router'
import { CssBaseline } from '@mui/material'
import { AuthContextProvider } from './context/AuthContext'
import { ThemeContextProvider } from './context/ThemeContext'
import Home from './routes/Home'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <ThemeContextProvider>
      <AuthContextProvider>
        <>
          <CssBaseline />
          <RouterProvider router={router} />
        </>
      </AuthContextProvider>
    </ThemeContextProvider>
  // </React.StrictMode>
)
