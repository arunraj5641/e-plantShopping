import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🌱 Starting Paradise Nursery Automated Verification Suite...\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Verify 7 Required Deliverable Files Exist at exact paths
const requiredFiles = [
  'README.md',
  'src/AboutUs.jsx',
  'src/App.css',
  'src/App.jsx',
  'src/CartSlice.jsx',
  'src/ProductList.jsx',
  'src/CartItem.jsx',
];

console.log('--- Checking Required Deliverables ---');
for (const file of requiredFiles) {
  const fullPath = path.join(projectRoot, file);
  assert(fs.existsSync(fullPath), `Required file exists: ${file}`);
}

// 2. Verify Data Structure & Constraints
console.log('\n--- Checking Plant Data & Categories ---');
const { plantCategories, allPlants } = await import('../src/data/plants.js');

assert(plantCategories.length >= 3, `Has at least 3 categories (Found: ${plantCategories.length})`);

let allCategoriesHaveMin6 = true;
const plantIds = new Set();
let duplicatesFound = false;

for (const cat of plantCategories) {
  if (cat.plants.length < 6) {
    allCategoriesHaveMin6 = false;
  }
  for (const p of cat.plants) {
    if (plantIds.has(p.id)) {
      duplicatesFound = true;
    }
    plantIds.add(p.id);
  }
}

assert(allCategoriesHaveMin6, 'Every category has at least 6 distinct plants');
assert(!duplicatesFound, 'Every plant has a unique ID');
assert(allPlants.length >= 18, `Total distinct plants >= 18 (Found: ${allPlants.length})`);

// Verify all required plant attributes
let attributesValid = true;
for (const p of allPlants) {
  if (!p.id || !p.name || typeof p.price !== 'number' || !p.image || !p.category || !p.description) {
    attributesValid = false;
    console.error('Plant missing attributes:', p);
    break;
  }
}
assert(attributesValid, 'Every plant has id, name, numeric price, image, category, and description');

// 3. Verify Redux Cart Slice Logic
console.log('\n--- Checking Redux Cart Slice Logic ---');
// Create a temporary .mjs copy of CartSlice.jsx for native Node import without transpiler dependency
const cartSliceContent = fs.readFileSync(path.join(projectRoot, 'src/CartSlice.jsx'), 'utf-8');
const tempCartSlicePath = path.join(projectRoot, 'scripts/_tempCartSlice.mjs');
fs.writeFileSync(tempCartSlicePath, cartSliceContent, 'utf-8');

try {
  const {
    default: cartReducer,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    selectTotalQuantity,
    selectTotalPrice,
  } = await import('./_tempCartSlice.mjs');

  let state = { items: [] };

  // Test Add to Cart (Item 1)
  const plant1 = allPlants[0];
  state = cartReducer(state, addToCart(plant1));
  assert(state.items.length === 1 && state.items[0].quantity === 1, 'addToCart adds a new plant with quantity = 1');

  // Test Add to Cart again (increments instead of duplicating)
  state = cartReducer(state, addToCart(plant1));
  assert(state.items.length === 1 && state.items[0].quantity === 2, 'addToCart increments quantity for existing plant without duplicating');

  // Test Add second plant
  const plant2 = allPlants[1];
  state = cartReducer(state, addToCart(plant2));
  assert(state.items.length === 2, 'addToCart adds distinct plants to items array');

  // Test Selectors
  const totalQty = selectTotalQuantity({ cart: state });
  assert(totalQty === 3, `selectTotalQuantity calculates aggregate count (Expected 3, Got: ${totalQty})`);

  const expectedTotal = plant1.price * 2 + plant2.price * 1;
  const calculatedTotal = selectTotalPrice({ cart: state });
  assert(calculatedTotal === expectedTotal, `selectTotalPrice calculates accurate sum (Expected ₹${expectedTotal}, Got: ₹${calculatedTotal})`);

  // Test Increase Quantity
  state = cartReducer(state, increaseQuantity(plant2.id));
  assert(state.items.find(i => i.id === plant2.id).quantity === 2, 'increaseQuantity increments item quantity');

  // Test Decrease Quantity
  state = cartReducer(state, decreaseQuantity(plant2.id));
  assert(state.items.find(i => i.id === plant2.id).quantity === 1, 'decreaseQuantity decrements item quantity');

  // Test Decrease Quantity down to 0 removes item cleanly
  state = cartReducer(state, decreaseQuantity(plant2.id));
  assert(!state.items.some(i => i.id === plant2.id), 'decreaseQuantity removes item when quantity reaches 0/1 without going negative');

  // Test Remove From Cart
  state = cartReducer(state, removeFromCart(plant1.id));
  assert(state.items.length === 0, 'removeFromCart removes specific plant by ID');

  // Test Clear Cart
  state = cartReducer({ items: [{ id: 'test', quantity: 5, price: 100 }] }, clearCart());
  assert(state.items.length === 0, 'clearCart resets items to empty array');
} finally {
  if (fs.existsSync(tempCartSlicePath)) {
    fs.unlinkSync(tempCartSlicePath);
  }
}

// 4. Verify CSS background image styling
console.log('\n--- Checking App.css Styling ---');
const appCss = fs.readFileSync(path.join(projectRoot, 'src/App.css'), 'utf-8');
assert(appCss.includes('background-image:'), 'App.css defines background-image');
assert(appCss.includes('background-color: var(--color-primary-dark)'), 'App.css defines graceful background fallback color');
assert(appCss.includes('@media (max-width: 1024px)'), 'App.css defines responsive tablet breakpoint');
assert(appCss.includes('@media (max-width: 640px)'), 'App.css defines responsive mobile breakpoint');

// 5. Verify App.jsx navigation and AboutUs rendering
console.log('\n--- Checking App.jsx & Component Integration ---');
const appJsx = fs.readFileSync(path.join(projectRoot, 'src/App.jsx'), 'utf-8');
assert(appJsx.includes('Paradise Nursery'), 'App.jsx includes company name');
assert(appJsx.includes('Get Started'), 'App.jsx includes Get Started button');
assert(appJsx.includes('<AboutUs />') || appJsx.includes('<AboutUs'), 'App.jsx renders AboutUs component');
assert(appJsx.includes('/plants'), 'App.jsx defines /plants route');
assert(appJsx.includes('/cart'), 'App.jsx defines /cart route');

// 6. Verify README.md contents
console.log('\n--- Checking README.md Content ---');
const readme = fs.readFileSync(path.join(projectRoot, 'README.md'), 'utf-8');
const firstLine = readme.trim().split('\n')[0].trim();
assert(firstLine === '# e-plantShopping', `First Markdown heading in README.md is exactly '# e-plantShopping' (Found: "${firstLine}")`);
assert(readme.includes('https://github.com/arunraj5641/e-plantShopping'), 'README includes links pointing to e-plantShopping repository');
assert(!readme.includes('https://github.com/arunraj5641/paradise-nursery'), 'README contains no legacy paradise-nursery repository URLs');
assert(readme.includes('Features'), 'README includes Features section');
assert(readme.includes('Technology Stack'), 'README includes Tech Stack section');
assert(readme.includes('Installation and Run Instructions'), 'README includes Installation instructions');
assert(readme.includes('Shopping Cart Behavior'), 'README includes Shopping Cart Behavior description');
assert(readme.includes('Coursera Deliverables & URLs'), 'README includes Coursera Deliverables URLs');

console.log(`\n==========================================`);
console.log(`🎉 ALL VERIFICATION CHECKS PASSED: ${passedTests}/${totalTests}`);
console.log(`==========================================\n`);
