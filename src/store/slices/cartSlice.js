import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [], itemCount: 0, total: 0 };
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return { items: [], itemCount: 0, total: 0 };
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        existingItem.quantity += quantity;
      } else {
        // Add new item to cart
        state.items.push({
          ...product,
          quantity
        });
      }
      
      // Recalculate totals
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Save to localStorage
      saveCartToStorage(state);
    },
    
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === itemId);
      
      if (itemIndex !== -1) {
        // Remove the item
        state.items.splice(itemIndex, 1);
        
        // Recalculate totals
        state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Save to localStorage
        saveCartToStorage(state);
      }
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.quantity = Math.max(1, quantity);
        
        // Recalculate totals
        state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Save to localStorage
        saveCartToStorage(state);
      }
    },
    
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.total = 0;
      
      // Clear from localStorage
      localStorage.removeItem('cart');
    },
    
    // Add this if you want to update item properties
    updateCartItem: (state, action) => {
      const { id, updates } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        Object.assign(item, updates);
        saveCartToStorage(state);
      }
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, updateCartItem } = cartSlice.actions;
export default cartSlice.reducer;