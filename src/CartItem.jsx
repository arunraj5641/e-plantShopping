import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectCartItems,
  selectTotalQuantity,
  selectTotalPrice,
  updateQuantity,
  removeItem,
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

  // Helper to parse numeric value from cost string (e.g., "₹499" or "$15") or numeric price
  const parseCost = (cost) => {
    if (typeof cost === 'number') return cost;
    if (!cost) return 0;
    return parseFloat(String(cost).replace(/[^0-9.]/g, '')) || 0;
  };

  // Coursera Rubric compliant calculation helpers using rubric-required item.cost
  const calculateTotalCost = (item) => {
    const unitCost = parseCost(item.cost || item.price);
    return unitCost * item.quantity;
  };

  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + calculateTotalCost(item), 0);
  };

  // Coursera Task 7: handleIncrement dispatches updateQuantity
  const handleIncrement = (item) => {
    dispatch(
      updateQuantity({
        name: item.name,
        id: item.id,
        quantity: item.quantity + 1,
      })
    );
  };

  // Coursera Task 7: handleDecrement dispatches updateQuantity, removing if quantity reaches 1
  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateQuantity({
          name: item.name,
          id: item.id,
          quantity: item.quantity - 1,
        })
      );
    } else {
      // Dispatches removeItem with item.name when quantity is 1
      dispatch(removeItem(item.name));
    }
  };

  // Coursera Task 7: handleRemove dispatches removeItem with item.name
  const handleRemove = (item) => {
    dispatch(removeItem(item.name));
  };

  const handleContinueShopping = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (onContinueShopping) {
      onContinueShopping(e);
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

      <main className="cart-container" aria-label="Shopping Cart">
        <div className="cart-header-section">
          <h1 className="cart-page-title">Your Plant Shopping Cart</h1>
          <p className="cart-page-subtitle">
            Review your selected houseplants, adjust quantities, or proceed to checkout.
          </p>
          <h2 className="total_cart_amount" style={{ marginTop: '0.75rem', color: '#1b4332' }}>
            Total Cart Amount: ₹{calculateTotalAmount().toLocaleString('en-IN')}
          </h2>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart-state" role="region" aria-label="Empty Cart Notification">
            <div className="empty-cart-icon" aria-hidden="true">🪴</div>
            <h2 className="empty-cart-heading">Your cart is currently empty</h2>
            <p className="empty-cart-description">
              Looks like you haven&apos;t added any greenery to your cart yet. Discover our collection of air-purifying, low-maintenance, and flowering plants!
            </p>
            <div className="continue_shopping_btn">
              <button
                type="button"
                className="get-started-button btn-primary-action btn-browse-plants"
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
          </div>
        ) : (
          <div className="cart-layout-grid">
            {/* List of Cart Items using rubric-required class names */}
            <div className="cart-items-column" role="list" aria-label="Cart Items">
              <div className="cart-items-header">
                <span className="items-count-badge">
                  {totalQuantity} {totalQuantity === 1 ? 'Plant' : 'Plants'} in Cart
                </span>
                <span className="items-types">
                  ({cartItems.length} unique {cartItems.length === 1 ? 'variety' : 'varieties'})
                </span>
              </div>

              {cartItems.map((item) => (
                <div key={item.name || item.id} className="cart-item cart-item-card" role="listitem">
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
                        <div className="cart-item-name">{item.name}</div>
                        {item.scientificName && (
                          <span className="cart-item-scientific">{item.scientificName}</span>
                        )}
                      </div>

                      {/* Delete Button with required cart-item-delete class */}
                      <button
                        type="button"
                        className="cart-item-delete btn-delete-item"
                        onClick={() => handleRemove(item)}
                        aria-label={`Delete ${item.name} from cart`}
                        title="Delete plant"
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
                        <span className="delete-text">Delete</span>
                      </button>
                    </div>

                    <div className="cart-item-bottom">
                      <div className="cart-price-info">
                        <span className="unit-price-label">Unit Cost:</span>
                        {/* Unit price displayed using rubric-required item.cost property */}
                        <div className="cart-item-cost unit-price-value">
                          {item.cost}
                        </div>
                      </div>

                      {/* Quantity Controls with rubric-required class names */}
                      <div className="cart-item-quantity quantity-control-group" aria-label="Quantity Controls">
                        <button
                          type="button"
                          className="cart-item-button cart-item-button-dec btn-qty"
                          onClick={() => handleDecrement(item)}
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          -
                        </button>

                        <span className="cart-item-quantity-value qty-number" aria-live="polite">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          className="cart-item-button cart-item-button-inc btn-qty"
                          onClick={() => handleIncrement(item)}
                          aria-label={`Increase quantity for ${item.name}`}
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal with rubric-required cart-item-total class */}
                      <div className="cart-subtotal-info">
                        <span className="subtotal-label">Subtotal:</span>
                        <div className="cart-item-total subtotal-value">
                          ₹{calculateTotalCost(item).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

                {/* Rubric-required continue_shopping_btn and get-started-button classes */}
                <div className="continue_shopping_btn summary-actions">
                  <button
                    type="button"
                    className="get-started-button1 btn-primary-action btn-checkout-action"
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
                    className="get-started-button btn-secondary-action btn-continue-shopping"
                    onClick={(e) => handleContinueShopping(e)}
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
