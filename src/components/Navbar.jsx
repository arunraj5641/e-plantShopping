import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectTotalQuantity } from '../CartSlice';

const Navbar = () => {
  const totalQuantity = useSelector(selectTotalQuantity);
  const location = useLocation();

  const isHomeActive = location.pathname === '/';
  const isPlantsActive = location.pathname === '/plants';
  const isCartActive = location.pathname === '/cart';

  return (
    <header className="navbar-container">
      <nav className="navbar" aria-label="Main Navigation">
        {/* Brand Logo and Name */}
        <Link to="/" className="navbar-brand" aria-label="Paradise Nursery Home">
          <div className="brand-icon-wrapper" aria-hidden="true">
            <svg
              className="brand-leaf-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">Paradise Nursery</span>
            <span className="brand-subtitle">Where Green Dreams Blossom</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="navbar-links">
          <Link
            to="/"
            className={`nav-link ${isHomeActive ? 'active' : ''}`}
            aria-current={isHomeActive ? 'page' : undefined}
          >
            Home
          </Link>
          <Link
            to="/plants"
            className={`nav-link ${isPlantsActive ? 'active' : ''}`}
            aria-current={isPlantsActive ? 'page' : undefined}
          >
            Plants
          </Link>
          <Link
            to="/cart"
            className={`nav-link nav-cart-btn ${isCartActive ? 'active' : ''}`}
            aria-label={`Shopping Cart with ${totalQuantity} items`}
            aria-current={isCartActive ? 'page' : undefined}
          >
            <span className="cart-icon-wrapper" aria-hidden="true">
              <svg
                className="cart-svg-icon"
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
              </svg>
            </span>
            <span className="cart-text">Cart</span>
            <span className="cart-badge" aria-live="polite">
              {totalQuantity}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
