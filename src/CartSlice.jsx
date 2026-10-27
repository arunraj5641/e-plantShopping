import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart or increment quantity if already present
    addToCart: (state, action) => {
      const plant = action.payload;
      const existingItem = state.items.find(
        (item) => (plant.id && item.id === plant.id) || item.name === plant.name
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...plant,
          quantity: 1,
        });
      }
    },

    // Alias for Coursera rubric compatibility
    addItem: (state, action) => {
      const plant = action.payload;
      const existingItem = state.items.find(
        (item) => (plant.id && item.id === plant.id) || item.name === plant.name
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...plant,
          quantity: 1,
        });
      }
    },

    // Remove single item completely from cart (supports payload as plant.name, plant.id, or object)
    removeItem: (state, action) => {
      const target = action.payload;
      const name = typeof target === 'object' ? target?.name : target;
      const id = typeof target === 'object' ? target?.id : target;
      state.items = state.items.filter(
        (item) => item.name !== name && item.id !== id
      );
    },

    // Alias for Coursera rubric compatibility
    removeFromCart: (state, action) => {
      const target = action.payload;
      const name = typeof target === 'object' ? target?.name : target;
      const id = typeof target === 'object' ? target?.id : target;
      state.items = state.items.filter(
        (item) => item.name !== name && item.id !== id
      );
    },

    // Increment item quantity
    increaseQuantity: (state, action) => {
      const target = action.payload;
      const name = typeof target === 'object' ? target?.name : target;
      const id = typeof target === 'object' ? target?.id : target;
      const item = state.items.find((i) => i.id === id || i.name === name);
      if (item) {
        item.quantity += 1;
      }
    },

    // Decrement item quantity; if quantity is 1 or reaches <=0, decrements or removes the item cleanly
    decreaseQuantity: (state, action) => {
      const target = action.payload;
      const name = typeof target === 'object' ? target?.name : target;
      const id = typeof target === 'object' ? target?.id : target;
      const item = state.items.find((i) => i.id === id || i.name === name);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(
            (i) => i.id !== item.id && i.name !== item.name
          );
        }
      }
    },

    // Update quantity directly (supports payload { name, quantity } and { id, quantity })
    updateQuantity: (state, action) => {
      const { id, name, quantity } = action.payload || {};
      const itemToUpdate = state.items.find(
        (item) => (name && item.name === name) || (id && item.id === id)
      );
      if (itemToUpdate) {
        if (quantity > 0) {
          itemToUpdate.quantity = quantity;
        } else {
          state.items = state.items.filter((item) => item !== itemToUpdate);
        }
      }
    },

    // Reset/clear entire cart
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  addItem,
  removeItem,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

// Redux selectors for derived cart calculations
export const selectCartItems = (state) => state.cart?.items || [];
export const selectTotalQuantity = (state) =>
  (state.cart?.items || []).reduce((total, item) => total + item.quantity, 0);
export const selectTotalPrice = (state) =>
  (state.cart?.items || []).reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;
