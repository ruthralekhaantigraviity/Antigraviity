import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import './Hero.css';

const Hero = () => {
    const navigate = useNavigate();

    // Mouse tracking for parallax (kept for potential future elements or title effect)
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e) => {
        // ... kept for potential interactivity
    };

    // Public Assets
    // Encode spaces for URL safety
    const tractorVideo = "/WhatsApp%20Video%202026-02-18%20at%204.36.51%20PM.mp4";

    return (
        <section
            className="hero"
            onMouseMove={handleMouseMove}
        >
            {/* Full Screen Video Background */}
            <div className="hero-video-container">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="hero-background-video"
                >
                    <source src={tractorVideo} type="video/mp4" />
                </video>
                <div className="hero-video-overlay"></div>
            </div>

            <div className="hero-content centered">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="badge">
                        <span className="badge-icon">🌿</span> 100% Organic & Fresh
                    </div>
                    <h1 className="hero-title">
                        Connecting <br />
                        <span className="highlight">Farmers & Friends</span>
                    </h1>
                    <p className="hero-subtitle">
                        Direct from the soil to your soul. Experience the purest produce and support local agriculture with transparent pricing.
                    </p>
                    <div className="hero-actions">
                        <button className="cta-button primary" onClick={() => navigate('/products')}>
                            Shop Now
                        </button>
                        <button className="cta-button secondary" onClick={() => navigate('/register')}>
                            Join as Farmer
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Visuals section removed as requested */}
        </section>
    );
};

export default Hero;
