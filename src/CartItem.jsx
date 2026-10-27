import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  selectCartItems,
  selectTotalQuantity,
  selectTotalPrice,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from './CartSlice';
import Navbar from './components/Navbar';

const FALLBACK_PLANT_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="%23e8f5e9"><rect width="400" height="300" fill="%23e8f5e9"/><path d="M200 60 C140 100 140 200 200 240 C260 200 260 100 200 60 Z" fill="%232e7d32" opacity="0.8"/><path d="M200 120 L200 240" stroke="%231b5e20" stroke-width="4"/><text x="50%25" y="85%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%232e7d32">Paradise Nursery Plant</text></svg>';

const CartItem = ({ onContinueShopping }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const totalQuantity = useSelector(selectTotalQuantity);
  const totalPrice = useSelector(selectTotalPrice);

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  // Coursera Rubric compliant calculation helpers
  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTotalCost = (item) => {
    return item.price * item.quantity;
  };

  const handleIncrement = (item) => {
    dispatch(increaseQuantity(item.id));
  };

  const handleDecrement = (item) => {
    dispatch(decreaseQuantity(item.id));
  };

  const handleRemove = (item) => {
    dispatch(removeFromCart(item.id));
  };

  const handleContinueShopping = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onContinueShopping) {
      onContinueShopping();
    } else {
      navigate('/plants');
    }
  };

  const handleCheckout = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setCheckoutModalOpen(true);
  };

  return (
    <div className="cart-page-wrapper">
      <Navbar />

      <main className="cart-container">
        <div className="cart-header-section">
          <h1 className="cart-page-title">Your Plant Shopping Cart</h1>
          <p className="cart-page-subtitle">
            Review your selected houseplants, adjust quantities, or proceed to checkout.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart-state" role="region" aria-label="Empty Cart Notification">
            <div className="empty-cart-icon" aria-hidden="true">🪴</div>
            <h2 className="empty-cart-heading">Your cart is currently empty</h2>
            <p className="empty-cart-description">
              Looks like you haven&apos;t added any greenery to your cart yet. Discover our collection of air-purifying, low-maintenance, and flowering plants!
            </p>
            <button
              type="button"
              className="btn-primary-action btn-browse-plants"
              onClick={handleContinueShopping}
              aria-label="Browse Plants"
            >
              <svg
                className="button-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span>Explore Plants Catalog</span>
            </button>
          </div>
        ) : (
          <div className="cart-layout-grid">
            {/* List of Cart Items */}
            <div className="cart-items-column" role="list" aria-label="Cart Items">
              <div className="cart-items-header">
                <span className="items-count-badge">
                  {totalQuantity} {totalQuantity === 1 ? 'Plant' : 'Plants'} in Cart
                </span>
                <span className="items-types">
                  ({cartItems.length} unique {cartItems.length === 1 ? 'variety' : 'varieties'})
                </span>
              </div>

              {cartItems.map((item) => {
                const itemTotal = calculateTotalCost(item);

                return (
                  <article key={item.id} className="cart-item-card" role="listitem">
                    <div className="cart-item-image-wrapper">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-image"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_PLANT_IMAGE;
                        }}
                      />
                    </div>

                    <div className="cart-item-details">
                      <div className="cart-item-top">
                        <div className="cart-item-info">
                          <span className="cart-item-category">{item.category}</span>
                          <h3 className="cart-item-name">{item.name}</h3>
                          {item.scientificName && (
                            <span className="cart-item-scientific">{item.scientificName}</span>
                          )}
                        </div>

                        <button
                          type="button"
                          className="btn-delete-item"
                          onClick={() => handleRemove(item)}
                          aria-label={`Remove ${item.name} from cart`}
                          title="Remove plant"
                        >
                          <svg
                            className="trash-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                          <span className="delete-text">Remove</span>
                        </button>
                      </div>

                      <div className="cart-item-bottom">
                        <div className="cart-price-info">
                          <span className="unit-price-label">Unit Price:</span>
                          <span className="unit-price-value">
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="quantity-control-group" aria-label="Quantity Controls">
                          <button
                            type="button"
                            className="btn-qty btn-qty-decrement"
                            onClick={() => handleDecrement(item)}
                            aria-label={`Decrease quantity for ${item.name}`}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </button>

                          <span className="qty-number" aria-live="polite">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            className="btn-qty btn-qty-increment"
                            onClick={() => handleIncrement(item)}
                            aria-label={`Increase quantity for ${item.name}`}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <line x1="12" y1="5" x2="12" y2="19" />
                              <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                          </button>
                        </div>

                        {/* Plant Subtotal */}
                        <div className="cart-subtotal-info">
                          <span className="subtotal-label">Subtotal:</span>
                          <span className="subtotal-value">
                            ₹{itemTotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Order Summary Sidebar */}
            <aside className="cart-summary-sidebar" aria-label="Order Summary">
              <div className="summary-card">
                <h2 className="summary-title">Order Summary</h2>

                <div className="summary-row">
                  <span className="summary-label">Total Plants ({totalQuantity} items):</span>
                  <span className="summary-val">₹{calculateTotalAmount().toLocaleString('en-IN')}</span>
                </div>

                <div className="summary-row">
                  <span className="summary-label">Botanical Packaging:</span>
                  <span className="summary-val free-badge">FREE</span>
                </div>

                <div className="summary-row">
                  <span className="summary-label">Delivery:</span>
                  <span className="summary-val free-badge">FREE</span>
                </div>

                <div className="summary-divider" />

                <div className="summary-row summary-total-row">
                  <span className="summary-total-label">Cart Total:</span>
                  <span className="summary-total-value">
                    ₹{calculateTotalAmount().toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="summary-tax-note">Inclusive of all taxes & sustainable potting guarantee</p>

                <div className="summary-actions">
                  <button
                    type="button"
                    className="btn-primary-action btn-checkout-action"
                    onClick={handleCheckout}
                    aria-label="Proceed to Checkout"
                  >
                    <span>Proceed to Checkout</span>
                    <svg
                      className="button-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="btn-secondary-action btn-continue-shopping"
                    onClick={handleContinueShopping}
                    aria-label="Continue Shopping"
                  >
                    <svg
                      className="button-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    <span>Continue Shopping</span>
                  </button>
                </div>

                <div className="summary-trust-badges">
                  <div className="trust-item">
                    <span className="trust-icon">🛡️</span>
                    <span>Safe & Secure Packaging</span>
                  </div>
                  <div className="trust-item">
                    <span className="trust-icon">🪴</span>
                    <span>Healthy Plant Arrival Guarantee</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* Checkout Modal / Coming Soon Message */}
        {checkoutModalOpen && (
          <div
            className="modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-modal-title"
          >
            <div className="checkout-modal-content">
              <div className="modal-icon" aria-hidden="true">🎉</div>
              <h2 id="checkout-modal-title" className="modal-title">
                Checkout Coming Soon!
              </h2>
              <p className="modal-description">
                Thank you for choosing <strong>Paradise Nursery</strong>! Our online checkout and doorstep botanical delivery portal is currently in final testing and will launch soon.
              </p>
              <div className="modal-order-recap">
                <span>Items in order: <strong>{totalQuantity}</strong></span>
                <span>Order Total: <strong>₹{calculateTotalAmount().toLocaleString('en-IN')}</strong></span>
              </div>
              <button
                type="button"
                className="btn-primary-action modal-close-btn"
                onClick={() => setCheckoutModalOpen(false)}
                autoFocus
              >
                Close & Return to Cart
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartItem;
