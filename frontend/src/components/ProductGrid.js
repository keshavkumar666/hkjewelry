import React, { useState } from 'react';
import { useProducts } from '../context/ProductsContext';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const categories = ['All', 'Pendant', 'Set', 'Earrings', 'Chain'];

const ProductGrid = () => {
  const { products } = useProducts();
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredProducts =
    filterCategory === 'All'
      ? products
      : products.filter((product) => product.category === filterCategory);

  return (
    <div className="product-grid-container">
      <div className="filter-section">
        <h2>Category</h2>
        <div className="filter-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${filterCategory === category ? 'active' : ''}`}
              onClick={() => setFilterCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
