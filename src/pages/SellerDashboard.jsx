import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    LayoutGrid, PlusCircle, ShoppingBag, Wallet, Star, Settings,
    LogOut, ShieldCheck, User, Loader, Trash2, Clock, CheckCircle
} from 'lucide-react';
import './Dashboard.css';

const SellerDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('inventory');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', unit: 'kg', category: 'Vegetables', image: '' });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('ff_token');

                // Fetch Products
                const prodResponse = await fetch('http://localhost:5000/api/products');
                const prodData = await prodResponse.json();
                setProducts(prodData);

                // Fetch Orders (Sellers see all orders in this demo)
                const orderResponse = await fetch('http://localhost:5000/api/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const orderData = await orderResponse.json();
                setOrders(orderData);

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchDashboardData();
    }, [user]);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newProduct, farmer_id: user.id })
            });
            if (response.ok) {
                alert('Product added successfully!');
                setActiveTab('inventory');
                window.location.reload();
            }
        } catch (err) {
            alert('Failed to add product');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProduct({ ...newProduct, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    if (!user || user.role !== 'seller') {
        return <div className="container section">Please login as a Farmer to view this page.</div>;
    }

    if (loading) return <div className="container section text-center" style={{ padding: '4rem' }}><Loader className="animate-spin" size={48} /></div>;

    const navItems = [
        { id: 'inventory', label: 'My Products', icon: LayoutGrid },
        { id: 'add', label: 'Add Product', icon: PlusCircle },
        { id: 'orders', label: 'Orders Received', icon: ShoppingBag },
        { id: 'wallet', label: 'Wallet / Coins', icon: Wallet },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'settings', label: 'Profile Settings', icon: Settings },
    ];

    return (
        <div className="container section dashboard">
            <div className="dashboard-sidebar">
                <div className="user-profile">
                    <div className="avatar seller-avatar">
                        <ShieldCheck size={32} color="#4CAF50" />
                    </div>
                    <h3>{user.name}</h3>
                    <p className="verified-status">Verified Farmer</p>
                </div>
                <nav className="dashboard-nav">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={activeTab === item.id ? 'active' : ''}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <item.icon size={18} /> {item.label}
                        </button>
                    ))}
                    <button onClick={logout} className="logout-btn"><LogOut size={18} /> Logout</button>
                </nav>
            </div>

            <div className="dashboard-content">
                {/* Inventory Tab */}
                {activeTab === 'inventory' && (
                    <div className="inventory-section">
                        <div className="section-header">
                            <h2 className="section-title">My Inventory</h2>
                            <button className="btn-primary" onClick={() => setActiveTab('add')}>+ Add New</button>
                        </div>
                        <div className="inventory-list">
                            {products.length === 0 ? <p>No products listed yet.</p> : products.map(product => (
                                <div key={product.id} className="inventory-item">
                                    <img src={product.image || 'https://via.placeholder.com/100'} alt={product.name} />
                                    <div className="item-info"><h4>{product.name}</h4><span>₹{product.price} / {product.unit}</span></div>
                                    <div className="item-stock">In Stock</div>
                                    <div className="item-actions">
                                        <button className="btn-text">Edit</button>
                                        <button className="btn-text remove"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add Product Tab */}
                {activeTab === 'add' && (
                    <div className="add-product-form">
                        <h2 className="section-title">Add New Product</h2>
                        <form className="dashboard-form" onSubmit={handleAddProduct}>
                            <div className="form-group"><label>Product Name</label><input type="text" placeholder="e.g. Fresh Sugarcane" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required /></div>
                            <div className="form-row">
                                <div className="form-group"><label>Price (₹)</label><input type="number" placeholder="0.00" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required /></div>
                                <div className="form-group">
                                    <label>Unit</label>
                                    <select value={newProduct.unit} onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}>
                                        <option>kg</option><option>bunch</option><option>litre</option><option>piece</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                                    <option>Vegetables</option>
                                    <option>Fruits</option>
                                    <option>Grains</option>
                                    <option>Flowers</option>
                                    <option>Dairy</option>
                                    <option>Seeds</option>
                                    <option>Sugarcane</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Product Photo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ padding: '0.5rem' }}
                                />
                                {newProduct.image && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <img src={newProduct.image} alt="Preview" style={{ height: '60px', borderRadius: '4px', border: '1px solid #ddd' }} />
                                    </div>
                                )}
                            </div>
                            <button className="btn-primary" type="submit">List Product</button>
                        </form>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="orders-section">
                        <h2 className="section-title">Orders Received</h2>
                        <div className="orders-list">
                            {orders.length === 0 ? <p>No orders received yet.</p> : orders.map(order => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <h4>Order #{order.id}</h4>
                                        <span className="order-date"><Clock size={14} /> {new Date(order.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="order-items">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="item-row">
                                                <span>{item.name} x {item.quantity}</span>
                                                <span>₹{item.price * item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="order-footer">
                                        <span className="order-total">Total: ₹{order.total}</span>
                                        <button className="btn-primary btn-sm">Mark Shipped</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Wallet Tab */}
                {activeTab === 'wallet' && (
                    <div className="wallet-section">
                        <h2 className="section-title">Farmer Wallet</h2>
                        <div className="stats-grid">
                            <div className="stat-card coin-card">
                                <Wallet size={32} />
                                <div><h3>₹{orders.reduce((acc, o) => acc + o.total, 0).toFixed(2)}</h3><p>Total Revenue</p></div>
                            </div>
                            <div className="stat-card">
                                <Star size={32} color="#FFC107" />
                                <div><h3>{user.coins}</h3><p>Farmer Coins</p></div>
                            </div>
                        </div>
                        <h3 style={{ marginTop: '2rem' }}>Transaction History</h3>
                        <p className="text-muted">No recent transactions.</p>
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                    <div className="reviews-section">
                        <h2 className="section-title">Customer Reviews</h2>
                        <div className="review-stats" style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                            <div className="rating-big">
                                <span className="score">4.8</span>
                                <div className="stars"><Star size={20} fill="#FFC107" color="#FFC107" /><Star size={20} fill="#FFC107" color="#FFC107" /><Star size={20} fill="#FFC107" color="#FFC107" /><Star size={20} fill="#FFC107" color="#FFC107" /><Star size={20} fill="#FFC107" color="#FFC107" /></div>
                                <p>Average Rating</p>
                            </div>
                        </div>
                        <p>No reviews yet. Your quality produce will soon get noticed!</p>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="settings-section">
                        <h2 className="section-title">Profile Settings</h2>
                        <form className="dashboard-form" onSubmit={e => e.preventDefault()}>
                            <div className="form-group"><label>Full Name</label><input type="text" defaultValue={user.name} /></div>
                            <div className="form-group"><label>Email Address</label><input type="email" defaultValue={user.email} readOnly /></div>
                            <div className="form-group"><label>Profile Bio</label><textarea placeholder="Tell buyers about your farm..."></textarea></div>
                            <button className="btn-primary">Save Changes</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;
