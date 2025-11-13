import React, { useState, useEffect } from "react";
import ProductUploadForm from "../ProductUploadForm";

const categories = [
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

function ProductManager() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error);
  }, []);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleProductSubmit = async (formData) => {
    try {
      const files = formData.getAll("images");
      const base64Images = [];
      for (const file of files) {
        const base64 = await fileToBase64(file);
        base64Images.push(base64);
      }

      const productData = {
        title: formData.get("title"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price")),
        categories: JSON.parse(formData.get("categories")),
        images: base64Images,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) throw new Error("Failed to upload product");

      const savedProduct = await response.json();
      setProducts((prev) => [...prev, savedProduct]);

      alert("Product uploaded successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <ProductUploadForm categories={categories} onSubmit={handleProductSubmit} />
      <hr />
      <h2>Products Added ({products.length})</h2>
      {products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 20 }}>
          {products.map((product) => (
            <div
              key={product._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 20,
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3>{product.title}</h3>
              <p>
                <strong>Price:</strong> ${product.price}
              </p>
              <p>
                <strong>Categories:</strong> {product.categories.join(", ")}
              </p>
              <p>
                <strong>Description:</strong> {product.description}
              </p>
              <div>
                <strong>Images ({product.images.length}):</strong>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 10,
                    flexWrap: "wrap",
                  }}
                >
                  {product.images.map((img, idx) => (
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
                Added: {new Date(product.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductManager;

