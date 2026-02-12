import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/mockData';
import { ShieldCheck, Truck, Users } from 'lucide-react';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <Hero />

            {/* Categories Section */}
            <section className="section-categories container">
                <h2 className="section-title">Shop by Category</h2>
                <div className="categories-grid">
                    {categories.slice(0, 3).map((cat) => (
                        <div
                            key={cat.id}
                            className="category-card"
                            onClick={() => navigate(`/products?category=${cat.name}`)}
                        >
                            <div className="category-icon">
                                <img src={cat.icon} alt={cat.name} />
                            </div>
                            <h3>{cat.name}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="section-featured container">
                <h2 className="section-title">Fresh from the Farm</h2>
                <p className="section-subtitle">Handpicked organic produce just for you</p>

                <div className="products-grid">
                    {products.slice(0, 6).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="view-all-container">
                    <button
                        className="btn-secondary"
                        onClick={() => navigate('/products')}
                    >
                        View All Products
                    </button>
                </div>
            </section>

            {/* Trust Section */}
            <section className="section-trust container">
                <div className="trust-features">
                    <div className="feature">
                        <div className="feature-icon"><ShieldCheck size={32} /></div>
                        <h3>Verified Farmers</h3>
                        <p>Every seller is KYC verified for quality assurance.</p>
                    </div>
                    <div className="feature">
                        <div className="feature-icon"><Truck size={32} /></div>
                        <h3>Farm to Table</h3>
                        <p>Direct delivery from farms with no middlemen.</p>
                    </div>
                    <div className="feature">
                        <div className="feature-icon"><Users size={32} /></div>
                        <h3>Community First</h3>
                        <p>Supporting local agriculture and fair prices.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;



