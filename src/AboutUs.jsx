import React from 'react';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-badge">Our Story & Mission</div>
      <h2 id="about-us-heading" className="about-us-title">
        About Paradise Nursery
      </h2>
      <p className="about-us-tagline">
        Welcome to Paradise Nursery — Nurturing lives, purifying spaces, and bringing the soothing beauty of nature directly into your home.
      </p>

      <div className="about-us-body">
        <p>
          At <strong>Paradise Nursery</strong>, our mission is to make green living effortless, accessible, and delightful for everyone. We believe that every living room, office desk, and balcony deserves to breathe with natural life. Founded by passionate botanists and plant lovers, Paradise Nursery offers an exceptional range of vibrant, sustainably nurtured houseplants designed to purify indoor air, elevate mental well-being, and transform living spaces into flourishing sanctuaries.
        </p>
        <p>
          Our services include careful organic cultivation, rigorous health inspections, sustainable eco-friendly potting, and secure doorstep packaging to ensure every plant arrives at your home thriving and ready to grow. From powerful air-purifying bio-filters and resilient low-maintenance succulents to aromatic floral varieties, we provide customized plant care advice and ongoing support for novice plant parents and seasoned indoor gardeners alike.
        </p>
        <p>
          Whether you are looking to enhance your workspace productivity, cleanse household air toxins, or simply add a touch of tranquil elegance to your surroundings, Paradise Nursery is your trusted botanical partner in creating healthier, happier, and greener spaces.
        </p>
      </div>

      {/* Core Value & Services Highlights */}
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
            <h3>Air-Purifying Bio-Filters</h3>
            <p>Scientifically proven varieties that cleanse indoor toxins and elevate oxygen.</p>
          </div>
        </div>

        <div className="highlight-item">
          <div className="highlight-icon" aria-hidden="true">💚</div>
          <div className="highlight-text">
            <h3>Expert Plant Care & Guarantee</h3>
            <p>Healthy plant arrival guarantee and lifetime guidance for every plant parent.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
