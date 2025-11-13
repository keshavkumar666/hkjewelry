import React from "react";
import { useProducts } from "../context/ProductsContext";
import { Link } from "react-router-dom";

function Home() {
  const { products, loading } = useProducts();

  return (
    <div style={{ maxWidth: 1200, margin: "auto", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: "48px", color: "#333", marginBottom: 10 }}>
          Welcome to HK Jewelry Shop
        </h1>
        <p style={{ fontSize: "18px", color: "#666" }}>
          Explore our beautiful collection of jewelry
        </p>
      </div>

      <h2 style={{ marginTop: 40, marginBottom: 20 }}>
        Featured Products ({products.length})
      </h2>

      {loading ? (
        <p style={{ textAlign: "center", fontSize: "18px" }}>Loading products...</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "18px", color: "#999" }}>
          No products available yet.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: 20,
            marginBottom: 40,
          }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 15,
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <h3 style={{ marginTop: 0 }}>{product.title}</h3>

              <p style={{ marginBottom: 8 }}>
                <strong>Price:</strong> ₹{product.price}
              </p>

              <p style={{ marginBottom: 8 }}>
                <strong>Categories:</strong> {product.categories.join(", ")}
              </p>

              <p style={{ fontSize: "14px", color: "#666", marginBottom: 10 }}>
                {product.description}
              </p>

              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 4,
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                />
              )}

              <button
                style={{
                  marginTop: 10,
                  width: "100%",
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 40, textAlign: "center", paddingBottom: 40 }}>
        <Link
          to="/products"
          style={{
            fontSize: "18px",
            color: "#007bff",
            textDecoration: "none",
            padding: "10px 20px",
            border: "2px solid #007bff",
            borderRadius: 4,
            display: "inline-block",
            marginRight: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#007bff";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#007bff";
          }}
        >
          View All Products →
        </Link>

        {/* Admin Upload Link - Moved to Bottom */}
        <Link
          to="/admin/upload"
          style={{
            fontSize: "18px",
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "#fff",
            textDecoration: "none",
            borderRadius: 4,
            display: "inline-block",
            fontWeight: "bold",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#218838")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
        >
          + Add New Product
        </Link>
      </div>
    </div>
  );
}

export default Home;
