import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaWhatsapp, FaShoppingCart } from 'react-icons/fa';
import './ProductCard.css';


const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const clientWhatsAppNumber = "918758790801";

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };


const message = `Hello, I am interested in your product: ${product.name}. Please share more details.`;
const encodedMessage = encodeURIComponent(message);
const whatsappUrl = `https://wa.me/${clientWhatsAppNumber}?text=${encodedMessage}`;



  const handleImageDownload = () => {
    const link = document.createElement('a');
    link.href = product.image;
    link.download = `${product.name}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="product-card" role="region" aria-label={product.name}>
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          onClick={handleImageDownload}
          style={{ cursor: 'pointer' }}
          title="Click to download image"
          loading="lazy"
        />
      </div>
      <div className="product-info">
        <Link to={`/product/${product.id}`} className="product-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-footer">
          <p className="product-price">₹ {product.price}</p>
          <button
            className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
            onClick={handleAddToCart}
            title={isAdded ? "Added to Cart" : "Add to Cart"}
            aria-pressed={isAdded}
          >
            <FaShoppingCart aria-hidden="true" />
            <span className="sr-only">Add to Cart</span>
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
            aria-label={`Chat on WhatsApp about ${product.name}`}
          >
            <FaWhatsapp style={{ marginRight: '5px' }} size={15} aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
