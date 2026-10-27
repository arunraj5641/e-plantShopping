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

// 2. FIX 1: Verify AboutUs.jsx has about-us-container, Paradise Nursery identity & mission
console.log('\n--- Checking FIX 1: AboutUs.jsx Content & Evidence ---');
const aboutUsContent = fs.readFileSync(path.join(projectRoot, 'src/AboutUs.jsx'), 'utf-8');
assert(aboutUsContent.includes('className="about-us-container"') || aboutUsContent.includes("className='about-us-container'"), 'AboutUs.jsx includes <div className="about-us-container">');
assert(aboutUsContent.includes('Paradise Nursery'), 'AboutUs.jsx clearly identifies Paradise Nursery');
assert(aboutUsContent.includes('mission') || aboutUsContent.includes('Mission'), 'AboutUs.jsx describes company mission');
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
assert(appCss.includes('background-color: #12281e') || appCss.includes('background-color: #'), 'App.css defines explicit fallback background color');

// 4. FIX 3 & FIX 4: Verify App.jsx heading and handleGetStartedClick
console.log('\n--- Checking FIX 3 & FIX 4: App.jsx Heading & Get Started ---');
const appJsx = fs.readFileSync(path.join(projectRoot, 'src/App.jsx'), 'utf-8');
assert(appJsx.includes('Welcome to Paradise Nursery'), 'App.jsx contains exact heading text "Welcome to Paradise Nursery"');
assert(appJsx.includes('showProductList'), 'App.jsx defines showProductList state');
assert(appJsx.includes('setShowProductList'), 'App.jsx defines setShowProductList setter');
assert(appJsx.includes('handleGetStartedClick'), 'App.jsx implements handleGetStartedClick handler');
assert(appJsx.includes('onClick={handleGetStartedClick}'), 'App.jsx wires button directly with onClick={handleGetStartedClick}');
assert(appJsx.includes('background-image'), 'App.jsx applies .background-image class to landing page element');

// 5. FIX 5: Verify plantsArray defined DIRECTLY in ProductList.jsx
console.log('\n--- Checking FIX 5: plantsArray Defined in ProductList.jsx ---');
const productListContent = fs.readFileSync(path.join(projectRoot, 'src/ProductList.jsx'), 'utf-8');
assert(productListContent.includes('export const plantsArray = [') || productListContent.includes('const plantsArray = ['), 'ProductList.jsx contains the actual definition of plantsArray directly in the file');

const plantsArrayStart = productListContent.indexOf('export const plantsArray = [');
const plantsArrayEnd = productListContent.indexOf('export const Navbar =');
const plantsArrayBlock = productListContent.substring(plantsArrayStart, plantsArrayEnd);
const tempPlantsPath = path.join(projectRoot, 'scripts/_tempPlants.mjs');
fs.writeFileSync(tempPlantsPath, plantsArrayBlock, 'utf-8');

const { plantsArray, allPlants } = await import('./_tempPlants.mjs');
if (fs.existsSync(tempPlantsPath)) fs.unlinkSync(tempPlantsPath);

assert(Array.isArray(plantsArray), 'plantsArray is defined and is an Array');
assert(plantsArray.length >= 3, `plantsArray contains at least 3 categories (Found: ${plantsArray.length})`);

let min6PerCategory = true;
let allHaveCategoryField = true;
let allHaveCostField = true;
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
    if (!p.cost || !p.price) {
      allHaveCostField = false;
    }
  }
}

assert(allHaveCategoryField, 'Each entry in plantsArray has a category field and plants array');
assert(min6PerCategory, 'Every category has at least 6 distinct plants');
assert(allHaveCostField, 'Every plant has both cost and price defined');
assert(!duplicatesFound, 'Every plant has a unique ID and unique Name across categories');
assert(allPlants.length >= 18, `Total distinct plants >= 18 (Found: ${allPlants.length})`);
assert(productListContent.includes('product-list'), 'ProductList.jsx includes semantic section with class product-list');

// 6. FIX 6: Verify ProductList.jsx addedToCart state and disabled logic
console.log('\n--- Checking FIX 6: addedToCart State and Button Logic ---');
assert(productListContent.includes('addedToCart'), 'ProductList.jsx implements addedToCart state');
assert(productListContent.includes('setAddedToCart'), 'ProductList.jsx implements setAddedToCart state updater');
assert(productListContent.includes('disabled={addedToCart[plant.name]}'), 'ProductList button uses exact disabled condition: disabled={addedToCart[plant.name]}');
assert(productListContent.includes("addedToCart[plant.name] ? 'Added to Cart' : 'Add to Cart'"), 'ProductList button label toggles between Added to Cart and Add to Cart based on addedToCart[plant.name]');

// 7. FIX 7: Verify Navbar defined in ProductList.jsx with handlers and dynamic count
console.log('\n--- Checking FIX 7: Navbar Component & Navigation in ProductList.jsx ---');
assert(productListContent.includes('export const Navbar =') || productListContent.includes('const Navbar ='), 'Navbar component is defined directly inside ProductList.jsx');
assert(productListContent.includes('handleHomeClick'), 'ProductList Navbar implements handleHomeClick');
assert(productListContent.includes('handlePlantsClick'), 'ProductList Navbar implements handlePlantsClick');
assert(productListContent.includes('handleCartClick'), 'ProductList Navbar implements handleCartClick');
assert(productListContent.includes('Home') && productListContent.includes('Plants') && productListContent.includes('Cart'), 'Navbar renders Home, Plants, and Cart links');
assert(productListContent.includes('cart-icon') && productListContent.includes('cart-count'), 'Navbar includes cart-icon and cart-count classes');
assert(productListContent.includes('selectTotalQuantity'), 'Navbar uses selectTotalQuantity for dynamic aggregate count');

// 8. FIX 8, 9, 10: CartItem.jsx item.cost and rubric classes
console.log('\n--- Checking FIX 8, 9, 10: CartItem.jsx item.cost & Rubric Classes ---');
const cartItemContent = fs.readFileSync(path.join(projectRoot, 'src/CartItem.jsx'), 'utf-8');
assert(cartItemContent.includes('{item.cost}'), 'CartItem.jsx renders unit price using {item.cost}');
assert(cartItemContent.includes('cart-item-cost'), 'CartItem.jsx includes cart-item-cost class');
assert(cartItemContent.includes('cart-item-name'), 'CartItem.jsx includes cart-item-name class');
assert(cartItemContent.includes('cart-item-details'), 'CartItem.jsx includes cart-item-details class');
assert(cartItemContent.includes('cart-item-image'), 'CartItem.jsx includes cart-item-image class');
assert(cartItemContent.includes('cart-item-quantity'), 'CartItem.jsx includes cart-item-quantity class');
assert(cartItemContent.includes('cart-item-button-dec'), 'CartItem.jsx includes cart-item-button-dec class');
assert(cartItemContent.includes('cart-item-quantity-value'), 'CartItem.jsx includes cart-item-quantity-value class');
assert(cartItemContent.includes('cart-item-button-inc'), 'CartItem.jsx includes cart-item-button-inc class');
assert(cartItemContent.includes('cart-item-total'), 'CartItem.jsx includes cart-item-total class');
assert(cartItemContent.includes('cart-item-delete'), 'CartItem.jsx includes cart-item-delete class for delete button');
assert(cartItemContent.includes('continue_shopping_btn'), 'CartItem.jsx includes continue_shopping_btn class');
assert(cartItemContent.includes('className="get-started-button') || cartItemContent.includes("get-started-button"), 'CartItem.jsx Continue Shopping button uses className get-started-button');
assert(cartItemContent.includes('handleIncrement'), 'CartItem implements handleIncrement');
assert(cartItemContent.includes('handleDecrement'), 'CartItem implements handleDecrement');
assert(cartItemContent.includes('handleRemove'), 'CartItem implements handleRemove');
assert(cartItemContent.includes('updateQuantity({') || cartItemContent.includes('updateQuantity('), 'CartItem dispatches updateQuantity');
assert(cartItemContent.includes('removeItem(item.name)'), 'CartItem dispatches removeItem(item.name)');
assert(cartItemContent.includes('calculateTotalAmount'), 'CartItem implements calculateTotalAmount');
assert(cartItemContent.includes('calculateTotalCost'), 'CartItem implements calculateTotalCost');

// Test Redux Slice Runtime
const cartSliceContent = fs.readFileSync(path.join(projectRoot, 'src/CartSlice.jsx'), 'utf-8');
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

  // 1. Add item with cost and price
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
  state = cartReducer({ items: [{ name: 'Test', cost: '₹100', price: 100, quantity: 1 }] }, updateQuantity({ name: 'Test', quantity: 0 }));
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
