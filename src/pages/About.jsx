import React from 'react';
import { Leaf, ShieldCheck, Heart, Truck } from 'lucide-react';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <section className="about-hero">
                <div className="container">
                    <h1>Bridging the Gap Between <br /><span className="highlight">Farms</span> and <span className="highlight">Forks</span></h1>
                    <p>FarmerFriend is a community-driven marketplace dedicated to empowering local farmers and providing customers with the freshest organic produce.</p>
                </div>
            </section>

            <section className="section container mission-vision">
                <div className="mission-card">
                    <Leaf size={40} color="var(--primary-color)" />
                    <h2>Our Mission</h2>
                    <p>To eliminate middlemen and ensure farmers get the fair price they deserve while customers get quality they can trust.</p>
                </div>
                <div className="mission-card">
                    <Heart size={40} color="#E91E63" />
                    <h2>Our Promise</h2>
                    <p>We only partner with verified, ethical farmers who prioritize organic and sustainable farming practices.</p>
                </div>
            </section>

            <section className="section bg-light">
                <div className="container">
                    <h2 className="section-title text-center">How It Works</h2>
                    <div className="how-it-works-grid">
                        <div className="step">
                            <div className="step-num">1</div>
                            <h3>Farmer Lists Produce</h3>
                            <p>Verified farmers list their fresh harvest directly on our platform.</p>
                        </div>
                        <div className="step">
                            <div className="step-num">2</div>
                            <h3>You Shop Fresh</h3>
                            <p>Browse through hundreds of organic items and support local farmers.</p>
                        </div>
                        <div className="step">
                            <div className="step-num">3</div>
                            <h3>Direct Delivery</h3>
                            <p>We ensure fast, farm-to-table delivery to maintain freshness.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
