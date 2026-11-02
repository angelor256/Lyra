import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ShopProvider } from './store/ShopContext'
import { CartProvider } from './store/CartContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <ShopProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </ShopProvider>
    </BrowserRouter>
  </React.StrictMode>
)
