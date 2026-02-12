import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import './Hero.css';

const Hero = () => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);


    // Mouse tracking for 3D effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    return (
        <section
            className="hero"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setIsHovered(true)}
        >
            <div className="hero-content">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="hero-title">
                        Connecting <br />
                        <span className="highlight">Farmers & Friends</span>
                    </h1>
                    <p className="hero-subtitle">
                        Direct from the soil to your soul. Experience the freshest produce and support local agriculture.
                    </p>
                    <div className="hero-actions">
                        <button className="cta-button primary" onClick={() => navigate('/products')}>Shop Now</button>
                        <button className="cta-button secondary" onClick={() => navigate('/register')}>Join as Farmer</button>
                    </div>
                </motion.div>
            </div>

            <div className="hero-scene-container">
                <motion.div
                    className="hero-scene"
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d"
                    }}
                >
                    {/* Background Glow */}
                    <div className="scene-glow"></div>

                    {/* Layer 2: Icon Sequence (Horizontal Flow) */}
                    <motion.div
                        className="icon-sequence-container"
                        style={{ translateZ: 100 }}
                    >
                        {/* Seed */}
                        <motion.div
                            className="sequence-item seed"
                            animate={{
                                y: [0, -20, 0],
                                rotateZ: [0, 5, 0]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <span className="icon-3d">🌱</span>
                            <span className="icon-label">Seed</span>
                        </motion.div>

                        <div className="connector">❯</div>

                        {/* Grow */}
                        <motion.div
                            className="sequence-item plant"
                            animate={{
                                y: [-10, 10, -10],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{ duration: 5, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
                        >
                            <span className="icon-3d">🌳</span>
                            <span className="icon-label">Grow</span>
                        </motion.div>

                        <div className="connector">❯</div>

                        {/* Buyer */}
                        <motion.div
                            className="sequence-item buyer"
                            animate={{
                                y: [0, -15, 0],
                                rotateZ: [0, -5, 0]
                            }}
                            transition={{ duration: 4, repeat: Infinity, delay: 1, ease: "easeInOut" }}
                        >
                            <span className="icon-3d">🛒</span>
                            <span className="icon-label">Buyer</span>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;




