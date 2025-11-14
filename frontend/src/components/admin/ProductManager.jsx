import React, { useState, useEffect, useCallback } from "react";
import ProductUploadForm from "../ProductUploadForm";

const categoriesList = [
  "Pendant",
  "Set",
  "Earrings",
  "Chain",
  "Ring",
  "Bracelet",
  "Necklace",
  "Anklet",
  "Bangle",
  "Nose Pin",
];

// Prefer environment variables in this order:
// - REACT_APP_API_URL (create-react-app)
// - NEXT_PUBLIC_API_URL (Next.js)
// - fallback to your Railway URL (only as last resort)
const API =
  process.env.REACT_APP_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://fulfilling-imagination-production.up.railway.app";

// If you need cookies/auth across domains, set REACT_APP_API_CREDENTIALS=true in Vercel (or env)
const INCLUDE_CREDENTIALS = process.env.REACT_APP_API_CREDENTIALS === "true";

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    if (!API) {
      setError("API base URL is not configured.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API}/api/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        ...(INCLUDE_CREDENTIALS ? { credentials: "include" } : {}),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Fetch failed: ${res.status} ${res.statusText} ${txt}`);
      }

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchProducts error:", err);
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleProductSubmit = async (formData) => {
    try {
      if (!API) throw new Error("API base URL not configured.");

      // images
      const files = formData.getAll("images") || [];
      const base64Images = [];
      for (const file of files) {
        // ignore non-file entries
        if (file && file instanceof File) {
          const base64 = await fileToBase64(file);
          base64Images.push(base64);
        }
      }

      // categories: try JSON.parse or fallback to comma-separated string
      let categories = [];
      const rawCategories = formData.get("categories");
      if (rawCategories) {
        try {
          categories = JSON.parse(rawCategories);
          if (!Array.isArray(categories)) categories = [];
        } catch {
          // not JSON — treat as comma separated
          categories = String(rawCategories)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }

      const productData = {
        title: formData.get("title") || "",
        description: formData.get("description") || "",
        price: parseFloat(formData.get("price")) || 0,
        categories,
        images: base64Images,
        createdAt: new Date().toISOString(),
      };

      const res = await fetch(`${API}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        ...(INCLUDE_CREDENTIALS ? { credentials: "include" } : {}),
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Upload failed: ${res.status} ${res.statusText} ${txt}`);
      }

      const savedProduct = await res.json();
      setProducts((prev) => [...prev, savedProduct]);

      alert("Product uploaded successfully!");
    } catch (err) {
      console.error("handleProductSubmit error:", err);
      alert(err.message || "Failed to upload product");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h1>Admin Dashboard</h1>

      {!API && (
        <div style={{ color: "red", marginBottom: 12 }}>
          API URL not configured. Set <code>REACT_APP_API_URL</code> or{" "}
          <code>NEXT_PUBLIC_API_URL</code> to your backend URL.
        </div>
      )}

      <ProductUploadForm categories={categoriesList} onSubmit={handleProductSubmit} />

      <hr />

      <h2>Products Added ({products.length})</h2>

      {loading ? (
        <p>Loading products…</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 20 }}>
          {products.map((product) => (
            <div
              key={product._id || product.id || Math.random()}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 20,
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3>{product.title}</h3>
              <p>
                <strong>Price:</strong> ${Number(product.price).toFixed(2)}
              </p>
              <p>
                <strong>Categories:</strong>{" "}
                {Array.isArray(product.categories) ? product.categories.join(", ") : String(product.categories)}
              </p>
              <p>
                <strong>Description:</strong> {product.description}
              </p>
              <div>
                <strong>Images ({(product.images && product.images.length) || 0}):</strong>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 10,
                    flexWrap: "wrap",
                  }}
                >
                  {(product.images || []).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`product-${idx}`}
                      style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 4 }}
                    />
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#999", marginTop: 10 }}>
                Added: {product.createdAt ? new Date(product.createdAt).toLocaleString() : "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductManager;
