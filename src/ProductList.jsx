import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCartItems } from './CartSlice';
import { plantCategories } from './data/plants';
import Navbar from './components/Navbar';

// Reliable SVG fallback for plant image error
const FALLBACK_PLANT_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="%23e8f5e9"><rect width="400" height="300" fill="%23e8f5e9"/><path d="M200 60 C140 100 140 200 200 240 C260 200 260 100 200 60 Z" fill="%232e7d32" opacity="0.8"/><path d="M200 120 L200 240" stroke="%231b5e20" stroke-width="4"/><text x="50%25" y="85%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%232e7d32">Paradise Nursery Plant</text></svg>';

const ProductList = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const [toastMessage, setToastMessage] = useState(null);

  const handleAddToCart = (plant) => {
    dispatch(addToCart(plant));
    setToastMessage(`"${plant.name}" added to your cart!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const isPlantInCart = (plantId) => {
    return cartItems.some((item) => item.id === plantId);
  };

  return (
    <div className="product-list-page">
      <Navbar />

      {/* Floating Alert / Toast */}
      {toastMessage && (
        <div className="toast-notification" role="status" aria-live="polite">
          <span className="toast-icon">🌿</span>
          <span className="toast-text">{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner for Products */}
      <section className="catalog-hero">
        <div className="catalog-hero-content">
          <span className="hero-pill">Handpicked Botanical Collection</span>
          <h1 className="catalog-title">Explore Our Houseplants</h1>
          <p className="catalog-subtitle">
            Carefully curated, sustainably nurtured houseplants designed to invigorate your interior sanctuary and elevate your everyday living.
          </p>
        </div>
      </section>

      {/* Product Categories Sections */}
      <main className="catalog-container">
        {plantCategories.map((category) => (
          <section
            key={category.name}
            className="category-section"
            aria-labelledby={`category-${category.name.replace(/\s+/g, '-').toLowerCase()}`}
          >
            <div className="category-header">
              <div className="category-header-info">
                <h2
                  id={`category-${category.name.replace(/\s+/g, '-').toLowerCase()}`}
                  className="category-title"
                >
                  {category.name}
                </h2>
                <p className="category-description">{category.description}</p>
              </div>
              <span className="category-badge">
                {category.plants.length} Varieties
              </span>
            </div>

            <div className="plants-grid">
              {category.plants.map((plant) => {
                const inCart = isPlantInCart(plant.id);

                return (
                  <article key={plant.id} className="plant-card">
                    <div className="plant-image-container">
                      <img
                        src={plant.image}
                        alt={plant.name}
                        className="plant-image"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_PLANT_IMAGE;
                        }}
                      />
                      <span className="plant-category-tag">{plant.category}</span>
                    </div>

                    <div className="plant-card-body">
                      <div className="plant-names">
                        <h3 className="plant-name">{plant.name}</h3>
                        {plant.scientificName && (
                          <span className="plant-scientific">
                            {plant.scientificName}
                          </span>
                        )}
                      </div>

                      <p className="plant-description">{plant.description}</p>

                      <div className="plant-card-footer">
                        <div className="plant-price-wrapper">
                          <span className="price-label">Price</span>
                          <span className="plant-price">
                            ₹{plant.price.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          type="button"
                          className={`btn-cart-action ${
                            inCart ? 'btn-added' : 'btn-add'
                          }`}
                          onClick={() => handleAddToCart(plant)}
                          disabled={inCart}
                          aria-disabled={inCart}
                          aria-label={
                            inCart
                              ? `${plant.name} is already in your cart`
                              : `Add ${plant.name} to cart for ₹${plant.price}`
                          }
                        >
                          {inCart ? (
                            <>
                              <svg
                                className="button-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span>Added to Cart</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="button-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="8" cy="21" r="1" />
                                <circle cx="19" cy="21" r="1" />
                                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                                <line x1="12" y1="5" x2="12" y2="11" />
                                <line x1="9" y1="8" x2="15" y2="8" />
                              </svg>
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default ProductList;
