import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, Minus, Plus, ShieldCheck, MapPin, Loader } from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setProduct(data);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product:', err);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product, quantity);
            navigate('/cart');
        }
    };

    if (loading) {
        return <div className="container section text-center"><Loader className="animate-spin" size={48} /></div>;
    }

    if (!product) {
        return <div className="container section text-center"><h2>Product not found</h2></div>;
    }

    return (
        <div className="container section product-details-page">
            <div className="product-details-grid">
                {/* Gallery */}
                <div className="product-gallery">
                    <div className="main-image">
                        <img src={product.image} alt={product.name} />
                    </div>
                </div>

                {/* Info */}
                <div className="product-info-detail">
                    <span className="category-badge">{product.category}</span>
                    <h1>{product.name}</h1>

                    <div className="rating-row">
                        <div className="stars">
                            <Star size={16} fill="#FFC107" stroke="none" />
                            <span>{product.rating} (124 reviews)</span>
                        </div>
                    </div>

                    <div className="price-block">
                        <span className="current-price">₹{product.price}</span>
                        <span className="per-unit">/ {product.unit}</span>
                    </div>

                    <p className="description">
                        Freshly harvested {product.name.toLowerCase()} directly from the farm.
                        Grown using organic farming methods without harmful pesticides.
                        Enjoy the natural taste and health benefits.
                    </p>

                    <div className="farmer-card">
                        <div className="farmer-avatar">
                            F
                        </div>
                        <div className="farmer-meta">
                            <h4>Verified Farmer <ShieldCheck size={14} color="#4CAF50" /></h4>
                            <span><MapPin size={12} /> Verified Seller</span>
                        </div>
                    </div>

                    <div className="actions">
                        <div className="quantity-selector">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                            >
                                <Minus size={16} />
                            </button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>
                                <Plus size={16} />
                            </button>
                        </div>

                        <button className="btn-primary add-to-cart-lg" onClick={handleAddToCart}>
                            <ShoppingCart size={20} /> Add to Cart
                        </button>
                    </div>

                    <div className="delivery-info">
                        <p>🚚 Standard Delivery: Get it by tomorrow</p>
                        <p>💰 Cash on Delivery available</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
