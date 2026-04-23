import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Trash2, Home, ArrowRight } from 'lucide-react';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get cart items from Redux store
  const cartItems = useSelector((state) => state.cart?.items || []);
  const itemCount = useSelector((state) => state.cart?.itemCount || 0);
  const totalPrice = useSelector((state) => state.cart?.total || 0);

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.success('Item removed from cart!');
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
      toast.success('Cart cleared successfully!');
    }
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    toast.info('Redirecting to checkout...');
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600 flex items-center">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {itemCount === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex flex-col items-center">
              <ShoppingCart className="w-20 h-20 text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-8 max-w-md">
                Looks like you haven't added any items to your cart yet. Start shopping to find amazing bedding products!
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-semibold"
                >
                  Go Home
                </Link>
                <Link
                  to="/products"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    Your Items ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
                
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex items-center hover:bg-gray-50 transition-colors">
                      {/* Product Image */}
                      <Link to={`/products/${item.slug}`} className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain hover:scale-105 transition-transform"
                        />
                      </Link>
                      
                      {/* Product Info */}
                      <div className="ml-6 flex-grow">
                        <Link to={`/products/${item.slug}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-blue-600">{item.name}</h3>
                        </Link>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center mt-3">
                          <span className="text-gray-600 mr-4">Quantity:</span>
                          <div className="flex items-center border rounded-lg overflow-hidden">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="px-4 py-1 border-x min-w-[40px] text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              disabled={!item.is_in_stock || item.quantity >= (item.stock_quantity || 10)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <p className="text-lg font-bold text-gray-900 mt-3">
                          ${(item.price * item.quantity).toFixed(2)}
                          <span className="text-sm text-gray-500 ml-2">
                            (${item.price.toFixed(2)} each)
                          </span>
                        </p>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors ml-4"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">Calculated at checkout</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">Calculated at checkout</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-3">
                    <button
                      onClick={handleProceedToCheckout}
                      className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center py-3 rounded-md font-semibold text-lg transition-colors"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                    
                    <button
                      onClick={handleContinueShopping}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-md font-semibold transition-colors"
                    >
                      Continue Shopping
                    </button>
                    
                    <Link
                      to="/"
                      className="block w-full text-center text-blue-600 hover:text-blue-800 py-2 text-sm"
                    >
                      ← Return to Home
                    </Link>
                  </div>
                  
                  {/* Security Badges */}
                  <div className="pt-6 border-t mt-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-green-600 font-bold text-sm">✓</div>
                        <div className="text-xs text-gray-600 mt-1">Secure Payment</div>
                      </div>
                      <div>
                        <div className="text-green-600 font-bold text-sm">✓</div>
                        <div className="text-xs text-gray-600 mt-1">Delivery Available</div>
                      </div>
                      <div>
                        <div className="text-green-600 font-bold text-sm">✓</div>
                        <div className="text-xs text-gray-600 mt-1">Secure Payment</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;