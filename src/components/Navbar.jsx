import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const { totalItems } = useCart();
    const { user } = useAuth();

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            navigate(`/products?search=${searchQuery}`);
            setIsMenuOpen(false);
        }
    };

    const dashboardLink = user?.role === 'seller' ? '/seller-dashboard' : '/buyer-dashboard';

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <Leaf className="logo-icon" size={28} />
                    <span className="logo-text">Farmer<span className="logo-highlight">Friend</span></span>
                </Link>

                {/* Search Bar (Desktop) */}
                <div className="navbar-search desktop-only">
                    <input
                        type="text"
                        placeholder="Search for fresh produce..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <button className="search-btn" onClick={handleSearch}><Search size={20} /></button>
                </div>

                {/* Desktop Links */}
                <ul className="navbar-links desktop-only">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/products">Marketplace</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>

                {/* Actions */}
                <div className="navbar-actions">
                    <Link to="/cart" className="action-btn">
                        <ShoppingCart size={24} />
                        {totalItems > 0 && <span className="badge">{totalItems}</span>}
                    </Link>
                    <Link to={user ? dashboardLink : "/login"} className="action-btn user-btn">
                        <User size={24} />
                        {user && <span className="user-name-label">{user.name.split(' ')[0]}</span>}
                    </Link>
                    <button className="menu-toggle mobile-only" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="mobile-menu">
                    <div className="mobile-search">
                        <input type="text" placeholder="Search..." />
                        <button><Search size={20} /></button>
                    </div>
                    <ul className="mobile-links">
                        <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                        <li><Link to="/products" onClick={() => setIsMenuOpen(false)}>Marketplace</Link></li>
                        <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
                        <li><Link to={user ? dashboardLink : "/login"} onClick={() => setIsMenuOpen(false)}>
                            {user ? 'My Profile' : 'Login / Sign Up'}
                        </Link></li>
                        <li><Link to="/cart" onClick={() => setIsMenuOpen(false)}>My Cart ({totalItems})</Link></li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
