import React from 'react';
import { Star, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
    };



    return (
        <div className="product-card">
            <div className="product-image">
                <img src={product.image} alt={product.name} loading="lazy" />
                <span className="category-tag">{product.category}</span>
            </div>

            <div className="product-info">
                <div className="product-header">
                    <h3>{product.name}</h3>
                    <div className="rating">
                        <Star size={14} fill="#FFC107" stroke="none" />
                        <span>{product.rating}</span>
                    </div>
                </div>

                <div className="farmer-info">
                    <User size={14} />
                    <span>{product.farmer}</span>
                </div>

                <div className="product-footer">
                    <div className="price">
                        ₹{product.price} <span className="unit">/ {product.unit}</span>
                    </div>
                    <button
                        className="add-cart-btn"
                        title="Add to Cart"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
