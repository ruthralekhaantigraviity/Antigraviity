import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, User, Tractor, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [role, setRole] = useState('buyer'); // 'buyer' or 'seller'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login(email, password);
        if (result.success) {
            // After successful login, the user object will be updated in context
            // We can navigate based on the role selected at login or fetch user role
            navigate(role === 'seller' ? '/seller-dashboard' : '/buyer-dashboard');
        } else {
            setError(result.error || 'Login failed');
        }
    };

    return (
        <div className="container section login-page">
            <div className="login-card">
                <div className="login-header">
                    <Leaf className="logo-icon" size={40} color="var(--primary-color)" />
                    <h2>Welcome Back</h2>
                    <p>Login to continue to FarmerFriend</p>
                </div>

                {error && (
                    <div className="error-message" style={{ color: '#d32f2f', background: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <div className="role-selector">
                    <button
                        className={role === 'buyer' ? 'active' : ''}
                        onClick={() => setRole('buyer')}
                    >
                        <User size={20} /> Buyer
                    </button>
                    <button
                        className={role === 'seller' ? 'active' : ''}
                        onClick={() => setRole('seller')}
                    >
                        <Tractor size={20} /> Farmer
                    </button>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary login-btn">
                        Login as {role === 'buyer' ? 'Buyer' : 'Farmer'}
                    </button>

                    <p className="signup-link">
                        New here? <Link to="/register">Create an account</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
