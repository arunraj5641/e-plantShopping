import React from 'react';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-badge">Our Story & Mission</div>
      <h2 id="about-us-heading" className="about-us-title">
        About Paradise Nursery
      </h2>
      <p className="about-us-tagline">
        Nurturing lives, purifying spaces, and bringing the soothing beauty of nature directly into your home.
      </p>

      <div className="about-us-body">
        <p>
          At <strong>Paradise Nursery</strong>, we believe that every home and workspace deserves to breathe with life. Founded by passionate botanists and plant lovers, our mission is to make green living effortless, accessible, and delightful for everyone.
        </p>
        <p>
          From low-maintenance succulents and air-cleansing bio-filters to aromatic flowering varieties, every houseplant in our collection is carefully inspected, sustainably nurtured, and potted with love. We don&apos;t just sell plants; we help you curate living sanctuaries that elevate your mental well-being, boost creativity, and purify your indoor atmosphere.
        </p>
        <p>
          Whether you are taking your first steps as a plant parent or expanding an indoor jungle, our team is dedicated to guiding you with tailored care advice, healthy specimens, and eco-friendly practices. Join us on our journey to create greener, healthier, and happier living spaces—one plant at a time.
        </p>
      </div>

      {/* Core Value Highlights */}
      <div className="about-highlights">
        <div className="highlight-item">
          <div className="highlight-icon" aria-hidden="true">🌱</div>
          <div className="highlight-text">
            <h3>100% Organically Grown</h3>
            <p>Sustainably cultivated without synthetic pesticides for natural vitality.</p>
          </div>
        </div>

        <div className="highlight-item">
          <div className="highlight-icon" aria-hidden="true">💨</div>
          <div className="highlight-text">
            <h3>Natural Bio-Purifiers</h3>
            <p>Proven varieties that filter airborne toxins and boost indoor oxygen.</p>
          </div>
        </div>

        <div className="highlight-item">
          <div className="highlight-icon" aria-hidden="true">💚</div>
          <div className="highlight-text">
            <h3>Plant Care Guarantee</h3>
            <p>Expert guidance and healthy-arrival guarantee for every botanical friend.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
