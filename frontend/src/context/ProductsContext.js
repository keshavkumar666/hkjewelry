// src/contexts/ProductsContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

export const ProductsContext = createContext();

function getApiBase() {
  // prefer NEXT_PUBLIC_API_URL (Vercel/Next), fallback to CRA var, else pick sensible default
  const envApi = process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL;
  if (envApi) return envApi;

  // If running on localhost (dev), use local backend; otherwise use production Railway URL
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }
  return "https://fulfilling-imagination-production.up.railway.app";
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API = getApiBase();
    const url = `${API}/api/products`;
    console.log("🔄 Fetching products from:", url);

    fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // credentials: 'include' // enable if you use cookies/sessions
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch products (${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Products loaded:", data);
        setProducts(data || []);
        setError(null);
      })
      .catch((err) => {
        console.error("❌ Error fetching products:", err);
        setError(err.message || "Failed to fetch products");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProductsContext.Provider value={{ products, setProducts, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
}

// Hook to use ProductsContext
export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductsProvider");
  }
  return context;
}
