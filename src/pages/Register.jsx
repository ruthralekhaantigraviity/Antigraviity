import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ShieldCheck, ArrowRight, Loader, Phone, MapPin, Briefcase, LayoutGrid } from 'lucide-react';
import toast from 'react-hot-toast';
import './Login.css';



const Register = () => {
    const location = useLocation();
    const [role, setRole] = useState('buyer');

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const roleFromUrl = queryParams.get('role');
        if (roleFromUrl === 'seller') {
            setRole('seller');
        } else if (roleFromUrl === 'buyer') {
            setRole('buyer');
        }
    }, [location.search]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobile: '',
        farmer_type: 'individual',
        category: 'Vegetables',
        experience: '',
        state: '',
        district: '',
        village: '',
        pincode: '',
        agree: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!formData.agree) {
            setError('Please agree to the Terms & Conditions');
            return;
        }

        setLoading(true);
        try {
            const result = await register({
                ...formData,
                role: role
            });

            if (result.success) {
                toast.success('Registration successful! Please login.');
                navigate('/login');
            } else {
                toast.error(result.error || 'Registration failed');
                setError(result.error || 'Registration failed');
            }
        } catch (err) {
            toast.error('Something went wrong. Please try again.');
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container container section">
            <div className="login-card" style={{ maxWidth: '600px' }}>
                <div className="login-header">
                    <h1>Join Farmer Friend</h1>
                    <p>Start your journey with us today</p>
                </div>

                <div className="role-selector" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button
                        className={`role-btn ${role === 'buyer' ? 'active' : ''}`}
                        onClick={() => setRole('buyer')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            borderRadius: '8px',
                            border: role === 'buyer' ? '2px solid var(--primary-color)' : '2px solid #eee',
                            background: role === 'buyer' ? 'var(--primary-light)' : 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <User size={24} color={role === 'buyer' ? 'var(--primary-color)' : '#666'} />
                        <span style={{ fontWeight: 'bold' }}>Buyer</span>
                    </button>
                    <button
                        className={`role-btn ${role === 'seller' ? 'active' : ''}`}
                        onClick={() => setRole('seller')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            borderRadius: '8px',
                            border: role === 'seller' ? '2px solid var(--secondary-dark)' : '2px solid #eee',
                            background: role === 'seller' ? '#fff9e6' : 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <ShieldCheck size={24} color={role === 'seller' ? 'var(--secondary-dark)' : '#666'} />
                        <span style={{ fontWeight: 'bold' }}>Farmer</span>
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-with-icon">
                                <User size={20} />
                                <input name="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Mobile Number</label>
                            <div className="input-with-icon">
                                <Phone size={20} />
                                <input name="mobile" type="tel" placeholder="10-digit number" value={formData.mobile} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                            <Mail size={20} />
                            <input name="email" type="email" placeholder="name@example.com" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>

                    {role === 'seller' && (
                        <div className="farmer-extended-fields">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Farmer Type</label>
                                    <div className="input-with-icon">
                                        <User size={20} />
                                        <select name="farmer_type" value={formData.farmer_type} onChange={handleChange}>
                                            <option value="individual">Individual</option>
                                            <option value="group">Group / Co-operative</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Category (What you sell)</label>
                                    <div className="input-with-icon">
                                        <LayoutGrid size={20} />
                                        <select name="category" value={formData.category} onChange={handleChange} required>
                                            <option value="Vegetables">Vegetables</option>
                                            <option value="Fruits">Fruits</option>
                                            <option value="Grains">Grains</option>
                                            <option value="Flowers">Flowers</option>
                                            <option value="Dairy">Dairy</option>
                                            <option value="Seeds">Seeds</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Experience (Years)</label>
                                <div className="input-with-icon">
                                    <Briefcase size={20} />
                                    <input name="experience" type="number" placeholder="Years of farming" value={formData.experience} onChange={handleChange} required />
                                </div>
                            </div>

                            <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Location Details</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>State</label>
                                    <input name="state" type="text" placeholder="e.g. Maharashtra" value={formData.state} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>District</label>
                                    <input name="district" type="text" placeholder="e.g. Pune" value={formData.district} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Village / City</label>
                                    <input name="village" type="text" placeholder="e.g. Ambegaon" value={formData.village} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Pincode</label>
                                    <input name="pincode" type="text" placeholder="6-digit code" value={formData.pincode} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-with-icon">
                                <Lock size={20} />
                                <input name="password" type="password" placeholder="Create password" value={formData.password} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <div className="input-with-icon">
                                <Lock size={20} />
                                <input name="confirmPassword" type="password" placeholder="Repeat password" value={formData.confirmPassword} onChange={handleChange} required />
                            </div>
                        </div>
                    </div>

                    <div className="form-group checkbox-group" style={{
                        display: 'flex',
                        gap: '0.75rem',
                        alignItems: 'flex-start',
                        marginTop: '1rem',
                        padding: '0.5rem 0'
                    }}>
                        <input
                            type="checkbox"
                            name="agree"
                            id="agree"
                            checked={formData.agree}
                            onChange={handleChange}
                            style={{
                                marginTop: '3px',
                                width: '18px',
                                height: '18px',
                                cursor: 'pointer',
                                accentColor: 'var(--primary-color)'
                            }}
                        />
                        <label htmlFor="agree" style={{
                            fontSize: '0.9rem',
                            lineHeight: '1.4',
                            cursor: 'pointer',
                            color: '#444'
                        }}>
                            I agree to the <a href="#" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Terms & Conditions</a> and Privacy Policy.
                        </label>
                    </div>

                    <button type="submit" className="btn-primary login-btn" disabled={loading}>
                        {loading ? <Loader className="animate-spin" size={20} /> : 'Register Now'} <ArrowRight size={20} />
                    </button>
                </form>

                <div className="login-footer">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
