# Paradise Nursery 🌿

Paradise Nursery is an online houseplant shopping cart web application designed to bring tranquility, nature, and clean air into every living and work space. Developed as the final capstone project for the Coursera React course, the application demonstrates modern React design patterns, centralized state management with Redux Toolkit, client-side routing with React Router, and an accessible, responsive botanical user interface.

---

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Shopping Cart Behavior](#shopping-cart-behavior)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation and Run Instructions](#installation-and-run-instructions)
- [Coursera Deliverables & URLs](#coursera-deliverables--urls)

---

## Project Description

Paradise Nursery provides a botanical shopping experience where plant enthusiasts can explore, learn about, and purchase a diverse selection of houseplants. The application features a rich botanical landing page with the company's story and mission, an organized catalog categorized into Air Purifying, Low Maintenance, and Aromatic varieties, and a functional shopping cart with live pricing, dynamic quantity adjustments, and Indian Rupee (₹) currency formatting.

---

## Features

- **Botanical Landing Page**:
  - Full-screen botanical background imagery styled directly through CSS.
  - Glassmorphic hero welcome card with brand mission and tagline.
  - Prominent **Get Started** button transitioning seamlessly into the plant catalog.
  - Integrated **About Us** section describing the nursery's organic ethos, bio-purifying benefits, and plant care guarantee.
- **Categorized Houseplant Catalog**:
  - 3 distinct plant categories: *Air Purifying Plants*, *Low Maintenance Plants*, and *Aromatic & Flowering Plants*.
  - 18 unique houseplants (6 per category) with thumbnail images, common names, botanical names, short descriptions, and prices in Indian Rupees (₹).
  - Graceful fallback image handling for resilient asset loading.
  - Toast notification confirmation when plants are added.
- **Dynamic Redux State Management**:
  - Add to Cart button automatically turns disabled and displays "Added to Cart" once the plant is in the cart.
  - Button state is derived directly from the Redux store.
  - If an item is deleted from the cart, its listing button immediately re-enables.
- **Global Responsive Navbar**:
  - Navigation links to Home, Plants, and Cart.
  - Active page indicators.
  - Dynamic cart counter showing the aggregate total item quantity in real time.
- **Interactive Shopping Cart Page**:
  - Detailed product breakdown with thumbnails, unit prices, interactive quantity increment/decrement controls, and line-item subtotals.
  - Real-time cart total calculation.
  - Immediate empty-cart state when all items are removed, with a one-click button to resume browsing.
  - "Continue Shopping" button returning to the catalog.
  - "Proceed to Checkout" modal displaying an informative "Coming Soon" notice with order recap.

---

## Shopping Cart Behavior

The shopping cart is powered by **Redux Toolkit** (`src/CartSlice.jsx`) following strict immutable state paradigms:

1. **Adding Items (`addToCart` / `addItem`)**:
   - When a user clicks "Add to Cart" on a plant card, the plant object is dispatched to Redux.
   - If the item is new, it is added with an initial quantity of `1`.
   - If the item already exists in the cart, its quantity increments by `1` rather than creating duplicate entries.
2. **Quantity Increments (`increaseQuantity`)**:
   - Clicking `+` dispatches an increment action targeting the unique item ID, immediately recalculating line totals and the grand total.
3. **Quantity Decrements (`decreaseQuantity`)**:
   - Clicking `-` decrements the quantity.
   - If the quantity reaches `1` and the user decrements, the item is safely removed from the cart to prevent zero or negative quantities.
4. **Item Removal (`removeFromCart` / `removeItem`)**:
   - Clicking the trash/remove button deletes that specific plant from the cart.
   - The listing button on the Products page immediately returns to an enabled "Add to Cart" state.
5. **Dynamic Calculations**:
   - All subtotals (`price * quantity`), total item counts (`sum of quantities`), and cart grand totals are computed reactively using Redux selectors, preventing out-of-sync derived state.
6. **Empty Cart Transition**:
   - When the last item is removed, the cart view instantly transitions to an empty state prompt with a direct call-to-action to explore plants.

---

## Technology Stack

- **React 18**: Component-based user interface architecture
- **Vite 5**: Fast development server and optimized production bundler
- **Redux Toolkit & React-Redux**: Centralized state management for shopping cart operations
- **React Router DOM 6**: Single-page application routing (`/`, `/plants`, `/cart`)
- **Vanilla CSS3**: Custom responsive design system with CSS tokens, flexbox, CSS grid, and glassmorphism
- **JavaScript (ES Modules & JSX)**: Modern clean ES6+ JavaScript

---

## Project Structure

```text
paradise-nursery/
├── README.md
├── package.json
├── vite.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── store.js
    ├── App.jsx
    ├── App.css
    ├── AboutUs.jsx
    ├── ProductList.jsx
    ├── CartItem.jsx
    ├── CartSlice.jsx
    ├── data/
    │   └── plants.js
    └── components/
        └── Navbar.jsx
```

---

## Installation and Run Instructions

### Prerequisites

Ensure you have **Node.js** (v18 or higher) and **npm** installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/arunraj5641/paradise-nursery.git
cd paradise-nursery
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173` (or the port displayed in your terminal).

### 4. Build for production
```bash
npm run build
```

### 5. Preview the production build locally
```bash
npm run preview
```

---

## Coursera Deliverables & URLs

Below are the permanent GitHub file links for grading against the Coursera rubric:

1. [README.md](https://github.com/arunraj5641/paradise-nursery/blob/main/README.md)
2. [src/AboutUs.jsx](https://github.com/arunraj5641/paradise-nursery/blob/main/src/AboutUs.jsx)
3. [src/App.css](https://github.com/arunraj5641/paradise-nursery/blob/main/src/App.css)
4. [src/App.jsx](https://github.com/arunraj5641/paradise-nursery/blob/main/src/App.jsx)
5. [src/CartSlice.jsx](https://github.com/arunraj5641/paradise-nursery/blob/main/src/CartSlice.jsx)
6. [src/ProductList.jsx](https://github.com/arunraj5641/paradise-nursery/blob/main/src/ProductList.jsx)
7. [src/CartItem.jsx](https://github.com/arunraj5641/paradise-nursery/blob/main/src/CartItem.jsx)
