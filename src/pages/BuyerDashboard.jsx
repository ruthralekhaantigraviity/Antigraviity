import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, Coins, User, Loader, Settings, LogOut, ShoppingBag } from 'lucide-react';
import './Dashboard.css';

const BuyerDashboard = () => {
    const { user, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('ff_token');
                const response = await fetch('http://localhost:5000/api/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setOrders(data);
                }
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchOrders();
    }, [user]);

    if (!user || user.role !== 'buyer') {
        return <div className="container section">Please login as a buyer to view this page.</div>;
    }

    if (loading) {
        return (
            <div className="container section text-center" style={{ padding: '8rem' }}>
                <Loader className="animate-spin" size={48} color="var(--primary-color)" />
                <p style={{ marginTop: '1rem', color: '#666' }}>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="container section dashboard">
            {/* Sidebar */}
            <div className="dashboard-sidebar">
                <div className="user-profile">
                    <div className="avatar">
                        <User size={36} />
                    </div>
                    <h3>{user.name}</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Community Member</p>
                </div>

                <nav className="dashboard-nav">
                    <button
                        className={activeTab === 'orders' ? 'active' : ''}
                        onClick={() => setActiveTab('orders')}
                    >
                        <ShoppingBag size={18} /> My Orders
                    </button>
                    <button
                        className={activeTab === 'settings' ? 'active' : ''}
                        onClick={() => setActiveTab('settings')}
                    >
                        <Settings size={18} /> Profile Settings
                    </button>
                    <button onClick={logout} className="logout-btn">
                        <LogOut size={18} /> Logout
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="dashboard-content">
                {activeTab === 'orders' ? (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card coin-card">
                                <div className="stat-icon" style={{ background: '#fff9e6', padding: '12px', borderRadius: '12px' }}>
                                    <Coins size={32} color="#fbc02d" />
                                </div>
                                <div>
                                    <h3>{user.coins}</h3>
                                    <p>Available Coins</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#e8f5e9', padding: '12px', borderRadius: '12px' }}>
                                    <Package size={32} color="var(--primary-color)" />
                                </div>
                                <div>
                                    <h3>{orders.length}</h3>
                                    <p>Total Orders</p>
                                </div>
                            </div>
                        </div>

                        <h2 className="section-title">My Recent Orders</h2>

                        <div className="orders-list">
                            {orders.length === 0 ? (
                                <div className="empty-state" style={{ textAlign: 'center', padding: '4rem 0' }}>
                                    <ShoppingBag size={48} color="#ddd" />
                                    <p style={{ marginTop: '1rem', color: '#888' }}>You haven't placed any orders yet.</p>
                                    <a href="/products" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>Start Shopping</a>
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-header">
                                            <div>
                                                <h4>Order #{order.id}</h4>
                                                <span className="order-date">
                                                    <Clock size={14} /> {new Date(order.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="order-items">
                                            {order.items.map((item, idx) => (
                                                <span key={idx} className="order-item-chip">
                                                    {item.name} x {item.quantity}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="order-footer">
                                            <span className="order-total">Total Amout: ₹{order.total}</span>
                                            <button className="btn-text" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Track Order</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                ) : (
                    <div className="settings-tab">
                        <h2 className="section-title">Profile Settings</h2>
                        <div className="dashboard-form" style={{ maxWidth: '500px' }}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" defaultValue={user.name} />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" defaultValue={user.email} disabled />
                            </div>
                            <button className="btn-primary">Update Profile</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuyerDashboard;
