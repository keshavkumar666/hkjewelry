import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ProductManager from "./components/admin/ProductManager"; // Admin dashboard with upload
import ProductApp from "./components/ProductApp";
import { ProductsProvider } from "./context/ProductsContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";

const backgroundStyle = {
  minHeight: "100vh",
  backgroundImage: "url('/backgroundj.jpg')", // Ensure this image is in the public folder
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
};

function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        <AuthProvider>
          <Router>
            <div style={backgroundStyle}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/admin/upload"
                  element={
                    <ProtectedRoute>
                      <ProductManager />
                    </ProtectedRoute>
                  }
                />
                <Route path="/products" element={<ProductApp />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </CartProvider>
    </ProductsProvider>
  );
}

export default App;
