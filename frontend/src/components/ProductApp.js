import React, { useState, useEffect } from "react";

function ProductApp() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const addProduct = () => {
    if (!newProduct.trim()) return;

    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newProduct.trim() }),
    })
      .then((res) => res.json())
      .then((addedProduct) => {
        setProducts((prev) => [...prev, ...addedProduct]);
        setNewProduct("");
      })
      .catch((err) => console.error("Error adding product:", err));
  };

  return (
    <div>
      <h2>Product List</h2>
      <input
        type="text"
        value={newProduct}
        onChange={(e) => setNewProduct(e.target.value)}
        placeholder="Enter product name"
      />
      <button onClick={addProduct}>Add Product</button>
      <ul>
        {products.map((prod) => (
          <li key={prod.id}>{prod.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ProductApp;
