import React from 'react';
import './Footer.css';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Farmer Friend</h3>
                        <p>Empowering farmers, connecting communities. Fresh, organic produce directly from the source to your table.</p>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/products">Shop</a></li>
                            <li><a href="/farmers">Our Farmers</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Contact Us</h4>
                        <ul>
                            <li><MapPin size={16} /> 123 Green Valley, Agri State</li>
                            <li><Phone size={16} /> +91 75399 23319</li>
                            <li><Mail size={16} /> ruthralekha1212@gmail.com</li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Follow Us</h4>
                        <div className="social-icons">
                            <a href="#"><Facebook size={24} /></a>
                            <a href="#"><Twitter size={24} /></a>
                            <a href="#"><Instagram size={24} /></a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Farmer Friend. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
