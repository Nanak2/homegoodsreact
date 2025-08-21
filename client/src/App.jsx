import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// User pages/components
import Home from "./pages/Home";
import Header from "./components/Header";
import Cart from "./components/Modals/Cart";
import Shop from "./pages/Shop";
import Footer from "./components/Footer";
import Checkout from "./components/Modals/Checkout";
import AdminLogin from "./components/Modals/AdminLogin";

// Admin pages
import Admin from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import Reports from "./pages/admin/Reports";

const getScreenSize = () => {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w <= 480) return "mobile";
  if (w <= 540) return "mobile-wide";
  if (w <= 768) return "tablet";
  if (w <= 1190) return "tablet-wide";
  return "desktop";
};

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [screenSize, setScreenSize] = useState(getScreenSize());

  // ✅ Single source of truth for admin
  const [showAdmin, setShowAdmin] = useState(
    () => localStorage.getItem("setShowAdmin") === "true"
  );

  const handleLoginSuccess = () => {
    localStorage.setItem("setShowAdmin", "true");
    setShowAdmin(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setIsAdminModalOpen(true);
      }
    };
    const handleResize = () => setScreenSize(getScreenSize());

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <div
          style={{
            transition: "margin-right 0.3s ease-in-out",
            marginRight: isCartOpen
              ? screenSize === "desktop"
                ? "25%"
                : screenSize === "tablet-wide"
                ? "40%"
                : screenSize === "tablet"
                ? "50%"
                : screenSize === "mobile-wide"
                ? "56%"
                : "0"
              : "0",
            display: "flex",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <div style={{ flex: "1 1 auto", overflowY: "auto" }}>
            <Header
              showAdmin={showAdmin}
              setShowAdmin={setShowAdmin}
              cartItems={cartItems}
              onCartClick={() => setIsCartOpen(true)}
            />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/shop"
                element={<Shop cartItems={cartItems} setCartItems={setCartItems} />}
              />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/customers" element={<Customers />} />
              <Route path="/admin/reports" element={<Reports />} />
            </Routes>

            <Footer />
          </div>
        </div>

        {/* ---- Modals ---- */}
        {isCartOpen && (
          <Cart
            cartItems={cartItems}
            setCartItems={setCartItems}
            onClose={() => setIsCartOpen(false)}
            openCheckout={() => {
              setIsCheckoutOpen(true);
              setIsCartOpen(false);
            }}
          />
        )}

        {isCheckoutOpen && (
          <Checkout cartItems={cartItems} setCartItems={setCartItems} onClose={() => setIsCheckoutOpen(false)} />
        )}

        {isAdminModalOpen && (
          <AdminLogin
            onClose={() => setIsAdminModalOpen(false)}
            onLoginSuccess={handleLoginSuccess} // ✅ updates App state
          />
        )}
      </BrowserRouter>
    </HelmetProvider>
  );
}
