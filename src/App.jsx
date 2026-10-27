import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProductList from './ProductList';
import CartItem from './CartItem';
import AboutUs from './AboutUs';
import Navbar from './components/Navbar';
import './App.css';

// Landing Page Component
const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/plants');
  };

  return (
    <div className="landing-page-wrapper">
      {/* Botanical Background Overlay Container styled via App.css */}
      <div className="landing-hero-backdrop">
        <header className="landing-header">
          <div className="landing-brand-badge">
            <span className="brand-leaf-symbol" aria-hidden="true">🌿</span>
            <span>Welcome to Nature&apos;s Sanctuary</span>
          </div>
        </header>

        <section className="landing-hero-section">
          <div className="landing-hero-card">
            <h1 className="landing-title">Paradise Nursery</h1>
            <p className="landing-tagline">
              Transforming your living and working spaces into flourishing, peaceful botanical sanctuaries.
            </p>
            <p className="landing-description">
              Explore our handpicked curation of resilient houseplants, powerful air-purifying greenery, and fragrant floral beauties. Every plant is nurtured with care, delivered to your door with love.
            </p>

            <div className="landing-cta-container">
              <button
                type="button"
                className="btn-get-started"
                onClick={handleGetStarted}
                aria-label="Get Started and explore our plants"
              >
                <span>Get Started</span>
                <svg
                  className="cta-arrow-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* About Us section rendered on the landing page for complete accessibility */}
        <section className="landing-about-container">
          <AboutUs />
        </section>

        <footer className="landing-footer">
          <p>© {new Date().getFullYear()} Paradise Nursery. All rights reserved. Cultivating green serenity.</p>
        </footer>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="app-root">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/plants" element={<ProductList />} />
        <Route path="/cart" element={<CartItem />} />
        {/* Catch-all route redirecting to landing page */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </div>
  );
}

export default App;
