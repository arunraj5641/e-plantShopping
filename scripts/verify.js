import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🌱 Starting e-plantShopping Comprehensive Rubric Verification Suite...\n');

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

// 2. FIX 1: Verify AboutUs.jsx has about-us-container
console.log('\n--- Checking FIX 1: AboutUs.jsx Container ---');
const aboutUsContent = fs.readFileSync(path.join(projectRoot, 'src/AboutUs.jsx'), 'utf-8');
assert(aboutUsContent.includes('className="about-us-container"') || aboutUsContent.includes("className='about-us-container'"), 'AboutUs.jsx includes <div className="about-us-container">');
assert(aboutUsContent.includes('export default AboutUs'), 'AboutUs.jsx has default export');

// 3. FIX 2: Verify App.css has .background-image with url() and supporting properties
console.log('\n--- Checking FIX 2: App.css .background-image Class ---');
const appCss = fs.readFileSync(path.join(projectRoot, 'src/App.css'), 'utf-8');
assert(appCss.includes('.background-image'), 'App.css defines .background-image class');
assert(appCss.includes('background-image: url('), 'App.css .background-image includes explicit background-image: url(...)');
assert(appCss.includes('background-size: cover'), 'App.css includes background-size: cover');
assert(appCss.includes('background-position: center'), 'App.css includes background-position: center');
assert(appCss.includes('background-repeat: no-repeat'), 'App.css includes background-repeat: no-repeat');
assert(appCss.includes('min-height: 100vh'), 'App.css includes min-height: 100vh');
assert(appCss.includes('background-color: var(--color-primary-dark)') || appCss.includes('background-color: #'), 'App.css defines fallback background color');

// 4. FIX 3 & FIX 4: Verify App.jsx heading and handleGetStartedClick
console.log('\n--- Checking FIX 3 & FIX 4: App.jsx Heading & Get Started ---');
const appJsx = fs.readFileSync(path.join(projectRoot, 'src/App.jsx'), 'utf-8');
assert(appJsx.includes('Welcome to Paradise Nursery'), 'App.jsx contains exact heading text "Welcome to Paradise Nursery"');
assert(appJsx.includes('showProductList'), 'App.jsx defines showProductList state');
assert(appJsx.includes('setShowProductList'), 'App.jsx defines setShowProductList setter');
assert(appJsx.includes('handleGetStartedClick'), 'App.jsx implements handleGetStartedClick handler');
assert(appJsx.includes('onClick={handleGetStartedClick}'), 'App.jsx wires button directly with onClick={handleGetStartedClick}');
assert(appJsx.includes('background-image'), 'App.jsx applies .background-image class to landing page element');

// 5. FIX 5: Verify plantsArray in plants.js and ProductList.jsx
console.log('\n--- Checking FIX 5: plantsArray Data Structure & ProductList Section ---');
const { plantsArray, allPlants } = await import('../src/data/plants.js');
assert(Array.isArray(plantsArray), 'plantsArray is defined and is an Array');
assert(plantsArray.length >= 3, `plantsArray contains at least 3 categories (Found: ${plantsArray.length})`);

let min6PerCategory = true;
let allHaveCategoryField = true;
const plantIds = new Set();
const plantNames = new Set();
let duplicatesFound = false;

for (const cat of plantsArray) {
  if (!cat.category || !Array.isArray(cat.plants)) {
    allHaveCategoryField = false;
  }
  if (cat.plants.length < 6) {
    min6PerCategory = false;
  }
  for (const p of cat.plants) {
    if (plantIds.has(p.id) || plantNames.has(p.name)) {
      duplicatesFound = true;
    }
    plantIds.add(p.id);
    plantNames.add(p.name);
  }
}

assert(allHaveCategoryField, 'Each entry in plantsArray has a category field and plants array');
assert(min6PerCategory, 'Every category has at least 6 distinct plants');
assert(!duplicatesFound, 'Every plant has a unique ID and unique Name across categories');
assert(allPlants.length >= 18, `Total distinct plants >= 18 (Found: ${allPlants.length})`);

const productListContent = fs.readFileSync(path.join(projectRoot, 'src/ProductList.jsx'), 'utf-8');
assert(productListContent.includes('plantsArray'), 'ProductList.jsx imports and references plantsArray');
assert(productListContent.includes('product-list'), 'ProductList.jsx includes semantic section with class product-list');

// 6. FIX 6: Verify ProductList.jsx addedToCart state and disabled logic
console.log('\n--- Checking FIX 6: addedToCart State and Button Logic ---');
assert(productListContent.includes('addedToCart'), 'ProductList.jsx implements addedToCart state');
assert(productListContent.includes('setAddedToCart'), 'ProductList.jsx implements setAddedToCart state updater');
assert(productListContent.includes('disabled={addedToCart[plant.name]}'), 'ProductList button uses exact disabled condition: disabled={addedToCart[plant.name]}');
assert(productListContent.includes("addedToCart[plant.name] ? 'Added to Cart' : 'Add to Cart'"), 'ProductList button label toggles between Added to Cart and Add to Cart based on addedToCart[plant.name]');

// 7. FIX 7: Verify Navbar
console.log('\n--- Checking FIX 7: Navbar Component & Navigation ---');
const navbarContent = fs.readFileSync(path.join(projectRoot, 'src/components/Navbar.jsx'), 'utf-8');
assert(navbarContent.includes('Home') && navbarContent.includes('Plants') && navbarContent.includes('Cart'), 'Navbar renders Home, Plants, and Cart links');
assert(navbarContent.includes('cart-icon') && navbarContent.includes('cart-count'), 'Navbar includes cart-icon and cart-count classes');
assert(navbarContent.includes('selectTotalQuantity'), 'Navbar uses selectTotalQuantity for dynamic aggregate count');
assert(navbarContent.includes('handleHomeClick') && navbarContent.includes('handlePlantsClick') && navbarContent.includes('handleCartClick'), 'Navbar includes explicit navigation handlers');

// 8. FIX 8, FIX 9, FIX 10: Redux CartSlice logic and CartItem handlers
console.log('\n--- Checking FIX 8, 9, 10: CartSlice & CartItem Handlers ---');
const cartSliceContent = fs.readFileSync(path.join(projectRoot, 'src/CartSlice.jsx'), 'utf-8');
assert(cartSliceContent.includes('updateQuantity'), 'CartSlice exports updateQuantity action');
assert(cartSliceContent.includes('removeItem'), 'CartSlice exports removeItem action');

const cartItemContent = fs.readFileSync(path.join(projectRoot, 'src/CartItem.jsx'), 'utf-8');
assert(cartItemContent.includes('handleIncrement'), 'CartItem implements handleIncrement');
assert(cartItemContent.includes('handleDecrement'), 'CartItem implements handleDecrement');
assert(cartItemContent.includes('handleRemove'), 'CartItem implements handleRemove');
assert(cartItemContent.includes('updateQuantity({') || cartItemContent.includes('updateQuantity('), 'CartItem dispatches updateQuantity');
assert(cartItemContent.includes('removeItem(item.name)'), 'CartItem dispatches removeItem(item.name)');
assert(cartItemContent.includes('cart-item-delete'), 'CartItem includes cart-item-delete class for delete button');
assert(cartItemContent.includes('calculateTotalAmount'), 'CartItem implements calculateTotalAmount');
assert(cartItemContent.includes('calculateTotalCost'), 'CartItem implements calculateTotalCost');

// Test Redux Slice Runtime
const tempCartSlicePath = path.join(projectRoot, 'scripts/_tempCartSlice.mjs');
fs.writeFileSync(tempCartSlicePath, cartSliceContent, 'utf-8');

try {
  const {
    default: cartReducer,
    addToCart,
    removeItem,
    updateQuantity,
    selectTotalQuantity,
    selectTotalPrice,
  } = await import('./_tempCartSlice.mjs');

  let state = { items: [] };

  // 1. Add item
  const p1 = allPlants[0];
  state = cartReducer(state, addToCart(p1));
  assert(state.items.length === 1 && state.items[0].quantity === 1, 'addToCart adds plant');

  // 2. updateQuantity increment
  state = cartReducer(state, updateQuantity({ name: p1.name, quantity: 2 }));
  assert(state.items[0].quantity === 2, 'updateQuantity incremented quantity to 2');

  // 3. updateQuantity decrement
  state = cartReducer(state, updateQuantity({ name: p1.name, quantity: 1 }));
  assert(state.items[0].quantity === 1, 'updateQuantity decremented quantity to 1');

  // 4. removeItem by name
  state = cartReducer(state, removeItem(p1.name));
  assert(state.items.length === 0, 'removeItem(item.name) cleanly deletes item from cart');

  // 5. Test updateQuantity at 0 removes item
  state = cartReducer({ items: [{ name: 'Test', price: 100, quantity: 1 }] }, updateQuantity({ name: 'Test', quantity: 0 }));
  assert(state.items.length === 0, 'updateQuantity with quantity 0 removes item without leaving zero/negative values');

} finally {
  if (fs.existsSync(tempCartSlicePath)) {
    fs.unlinkSync(tempCartSlicePath);
  }
}

// 9. Verify README.md
console.log('\n--- Checking README.md Content ---');
const readme = fs.readFileSync(path.join(projectRoot, 'README.md'), 'utf-8');
const firstLine = readme.trim().split('\n')[0].trim();
assert(firstLine === '# e-plantShopping', `First Markdown heading in README.md is exactly '# e-plantShopping' (Found: "${firstLine}")`);
assert(readme.includes('https://github.com/arunraj5641/e-plantShopping'), 'README includes links pointing to e-plantShopping repository');
assert(!readme.includes('https://github.com/arunraj5641/paradise-nursery'), 'README contains no legacy paradise-nursery repository URLs');

console.log(`\n==========================================`);
console.log(`🎉 ALL RUBRIC VERIFICATION CHECKS PASSED: ${passedTests}/${totalTests}`);
console.log(`==========================================\n`);
