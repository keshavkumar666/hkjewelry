import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  // Sample product data - replace with your actual data source
  const products = [
    {
      id: 1,
      name: 'Mic Diamond Pendant (Moti)',
      price: 735,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600',
      category: 'Pendant',
      description: 'Beautiful diamond pendant with pearl accents. Handcrafted with precision and care.',
      details: {
        material: 'Gold & Diamond',
        weight: '2.5 grams',
        purity: '18K Gold'
      }
    }
  ];

  const product = products.find(p => p.id === parseInt(id)) || products[0];

  return (
    <div className="product-detail-container">
      <Link to="/" className="back-btn">← Back to Products</Link>
      
      <div className="product-detail">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-category">{product.category}</p>
          <h2 className="product-detail-price">₹ {product.price}</h2>
          
          <p className="product-description">{product.description}</p>
          
          <div className="product-details">
            <h3>Product Details:</h3>
            <ul>
              <li><strong>Material:</strong> {product.details.material}</li>
              <li><strong>Weight:</strong> {product.details.weight}</li>
              <li><strong>Purity:</strong> {product.details.purity}</li>
            </ul>
          </div>
          
          <button 
            className="add-to-cart-detail-btn"
            onClick={() => addToCart(product)}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
