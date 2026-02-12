import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, Coins, Loader, CheckCircle } from 'lucide-react';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, subtotal, earnedCoins, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('ff_token');
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cartItems,
                    total: subtotal + 40 // Subtotal + Delivery
                })
            });

            if (response.ok) {
                setOrderSuccess(true);
                clearCart();
                setTimeout(() => navigate('/buyer-dashboard'), 3000);
            } else {
                alert('Order failed. Please try again.');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            alert('Server connection failed.');
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="container section text-center">
                <CheckCircle size={64} color="var(--primary-color)" />
                <h2>Order Placed Successfully!</h2>
                <p>Redirecting you to your dashboard to track your order...</p>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container section text-center empty-cart">
                <ShoppingBag size={64} color="#ccc" />
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any fresh produce yet.</p>
                <Link to="/products" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container section cart-page">
            <h1 className="page-title">Your Shopping Cart</h1>

            <div className="cart-layout">
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <div className="item-image">
                                <img src={item.image} alt={item.name} />
                            </div>
                            <div className="item-details">
                                <h3>{item.name}</h3>
                                <p className="item-farmer">Verified Seller</p>
                                <p className="item-price">₹{item.price} / {item.unit}</p>
                            </div>
                            <div className="item-actions">
                                <div className="quantity-ctrl">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                </div>
                                <div className="item-total">
                                    <span>₹{item.price * item.quantity}</span>
                                </div>
                                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery Fee</span>
                        <span>₹40</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{subtotal + 40}</span>
                    </div>

                    <div className="coin-reward">
                        <Coins size={20} color="#FFC107" />
                        <span>You will earn <strong>{earnedCoins} Coins</strong></span>
                    </div>

                    <button
                        className="btn-primary checkout-btn"
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        {loading ? <Loader className="animate-spin" size={20} /> : 'Proceed to Checkout'} <ArrowRight size={20} />
                    </button>

                    <p className="secure-text">🔒 Secure Checkout</p>
                </div>
            </div>
        </div>
    );
};

export default Cart;
