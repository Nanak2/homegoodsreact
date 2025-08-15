import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './pages/Home';
import Header from './components/Header';
import Admin from './pages/Admin';
import Cart from './components/Modals/Cart';
import Shop from './pages/Shop';
import Footer from './components/Footer';
import Checkout from './components/Modals/Checkout';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <HelmetProvider>
      <BrowserRouter>
        {/* Header with cart badge */}
        <Header 
          cartItems={cartItems} 
          onCartClick={() => setIsCartOpen(true)} 
        />  

        {/* Cart drawer */}
        {isCartOpen && (
          <Cart 
            cartItems={cartItems} 
            setCartItems={setCartItems}
            onClose={() => setIsCartOpen(false)}
            openCheckout={() => {
              setIsCheckoutOpen(true);  // open the checkout modal
              setIsCartOpen(false);     // close the cart
            }}
          />
        )}

        {/* Checkout modal */}
        {isCheckoutOpen && (
          <Checkout 
            cartItems={cartItems} 
            onClose={() => setIsCheckoutOpen(false)} 
          />
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop cartItems={cartItems} setCartItems={setCartItems} />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </HelmetProvider>
  );
}