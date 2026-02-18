import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, CreditCard, Banknote, Smartphone, ChevronRight, Lock, ShieldCheck } from 'lucide-react';
import './Payment.css';

const Payment = () => {
    const { subtotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState('upi');
    const [processing, setProcessing] = useState(false);

    // Total Amount (Subtotal + Delivery)
    const totalAmount = subtotal + 40;

    const handlePayment = () => {
        setProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setProcessing(false);
            clearCart();
            alert('Payment Successful! Order Placed.');
            navigate('/buyer-dashboard');
        }, 2000);
    };

    return (
        <div className="container section payment-page">
            <h1 className="page-title">Select Payment Method</h1>

            <div className="payment-layout">
                {/* Left Side: Payment Options */}
                <div className="payment-options">
                    <div className="payment-header">
                        <span className="secure-badge"><Lock size={14} /> 100% Secure Payments</span>
                    </div>

                    {/* Method: UPI */}
                    <div
                        className={`payment-method ${selectedMethod === 'upi' ? 'active' : ''}`}
                        onClick={() => setSelectedMethod('upi')}
                    >
                        <div className="method-icon">
                            <Smartphone size={24} color={selectedMethod === 'upi' ? '#fff' : '#666'} />
                        </div>
                        <div className="method-details">
                            <h3>UPI</h3>
                            <p>Google Pay, PhonePe, Paytm</p>
                        </div>
                        {selectedMethod === 'upi' && <CheckCircle size={20} className="check-icon" />}
                    </div>

                    {/* Method: Cards */}
                    <div
                        className={`payment-method ${selectedMethod === 'card' ? 'active' : ''}`}
                        onClick={() => setSelectedMethod('card')}
                    >
                        <div className="method-icon">
                            <CreditCard size={24} color={selectedMethod === 'card' ? '#fff' : '#666'} />
                        </div>
                        <div className="method-details">
                            <h3>Credit / Debit Cards</h3>
                            <p>Visa, Mastercard, Rupay</p>
                        </div>
                        {selectedMethod === 'card' && <CheckCircle size={20} className="check-icon" />}
                    </div>

                    {/* Method: COD */}
                    <div
                        className={`payment-method ${selectedMethod === 'cod' ? 'active' : ''}`}
                        onClick={() => setSelectedMethod('cod')}
                    >
                        <div className="method-icon">
                            <Banknote size={24} color={selectedMethod === 'cod' ? '#fff' : '#666'} />
                        </div>
                        <div className="method-details">
                            <h3>Cash on Delivery</h3>
                            <p>Pay cash at your doorstep</p>
                        </div>
                        {selectedMethod === 'cod' && <CheckCircle size={20} className="check-icon" />}
                    </div>

                    {/* Active Payment View (Simplified for Demo) */}
                    <div className="active-method-view">
                        {selectedMethod === 'upi' && (
                            <div className="upi-options">
                                <button className="upi-app">Google Pay</button>
                                <button className="upi-app">PhonePe</button>
                                <button className="upi-app">Paytm</button>
                                <div className="upi-id-input">
                                    <input type="text" placeholder="Enter UPI ID (e.g. mobile@upi)" />
                                    <button>Verify</button>
                                </div>
                            </div>
                        )}
                        {selectedMethod === 'card' && (
                            <div className="card-form">
                                <input type="text" placeholder="Card Number" className="full-width" />
                                <div className="card-row">
                                    <input type="text" placeholder="Valid Thru (MM/YY)" />
                                    <input type="text" placeholder="CVV" />
                                </div>
                                <input type="text" placeholder="Name on Card" className="full-width" />
                            </div>
                        )}
                        {selectedMethod === 'cod' && (
                            <div className="cod-info">
                                <p>Please keep exact change ready for a smooth delivery experience.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Payment Summary */}
                <div className="payment-summary">
                    <h2>Payment Details</h2>
                    <div className="summary-row">
                        <span>Total Bill</span>
                        <span>₹{totalAmount}</span>
                    </div>

                    <div className="safety-info">
                        <ShieldCheck size={40} color="#4CAF50" />
                        <p>Safe and secure payments. Easy returns.</p>
                    </div>

                    <button
                        className="pay-btn"
                        onClick={handlePayment}
                        disabled={processing}
                    >
                        {processing ? 'Processing...' : `Pay ₹${totalAmount}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payment;
