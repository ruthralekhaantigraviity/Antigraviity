import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { categories as mockCategories, products as mockProducts } from '../data/mockData';
import { Filter, SlidersHorizontal, SearchX, Loader } from 'lucide-react';
import './ProductList.css';

const ProductList = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchFromUrl = queryParams.get('search') || '';
    const categoryFromUrl = queryParams.get('category') || 'All';

    const [products, setProducts] = useState(mockProducts);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
    const [priceRange, setPriceRange] = useState(1000);


    useEffect(() => {
        setSelectedCategory(categoryFromUrl);
    }, [categoryFromUrl, searchFromUrl]);

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesPrice = product.price <= priceRange;
        const matchesSearch = product.name.toLowerCase().includes(searchFromUrl.toLowerCase());
        return matchesCategory && matchesPrice && matchesSearch;
    });

    if (loading) {
        return <div className="container section text-center"><Loader className="animate-spin" size={48} /></div>;
    }

    return (
        <div className="container section product-list-page">
            <header className="page-header">
                <h1>Marketplace</h1>
                {searchFromUrl ? (
                    <p>Search results for "{searchFromUrl}"</p>
                ) : (
                    <p>Direct from verified farmers to your doorstep</p>
                )}
            </header>

            <div className="marketplace-layout">
                {/* Sidebar Filters */}
                <aside className="filters-sidebar">
                    <div className="filter-group">
                        <h3><Filter size={18} /> Categories</h3>
                        <ul>
                            <li
                                className={selectedCategory === 'All' ? 'active' : ''}
                                onClick={() => setSelectedCategory('All')}
                            >
                                All Products
                            </li>
                            {mockCategories.map(cat => (
                                <li
                                    key={cat.id}
                                    className={selectedCategory === cat.name ? 'active' : ''}
                                    onClick={() => setSelectedCategory(cat.name)}
                                >
                                    {cat.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="filter-group">
                        <h3><SlidersHorizontal size={18} /> Price Range</h3>
                        <div className="price-slider">
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                            />
                            <div className="price-labels">
                                <span>₹0</span>
                                <span>Max: ₹{priceRange}</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <main className="products-content">
                    <div className="results-header">
                        <span>Showing {filteredProducts.length} results</span>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="products-grid">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <SearchX size={48} color="#ccc" />
                            <p>No products found matching your search.</p>
                            <button
                                className="btn-secondary"
                                onClick={() => {
                                    setSelectedCategory('All');
                                    setPriceRange(1000);
                                    window.history.replaceState({}, '', '/products');
                                }}
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductList;
