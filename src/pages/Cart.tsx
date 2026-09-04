import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const tax = cartTotal * 0.18; // 18% GST (Mock)
  const shipping = cartTotal > 500 ? 0 : 40;
  const finalTotal = cartTotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-48 h-48 bg-slate-100 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="w-20 h-20 text-slate-300" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Your cart is empty!</h1>
        <p className="text-slate-500 mb-8 max-w-md">Explore our wide selection and find something you like.</p>
        <Link to="/search" className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:-translate-y-0.5 transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart <span className="text-slate-400 text-xl font-normal">({cartCount} items)</span></h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cart Items */}
        <div className="lg:w-2/3 flex flex-col gap-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                key={item.product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 flex gap-4 sm:gap-6"
              >
                <Link to={`/product/${item.product.id}`} className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center p-2 border border-slate-100">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                </Link>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{item.product.brand}</div>
                      <Link to={`/product/${item.product.id}`} className="text-lg font-bold text-slate-900 hover:text-slate-600 transition-colors line-clamp-2">
                        {item.product.name}
                      </Link>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-slate-900">₹{item.product.price.toLocaleString('en-IN')}</div>
                      {item.product.discount > 0 && (
                        <div className="text-sm text-slate-400 line-through">₹{item.product.mrp.toLocaleString('en-IN')}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-slate-600"
                      >
                        <Minus className="w-3 h-3 text-slate-600" />
                      </button>
                      <span className="w-10 text-center font-semibold text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-slate-600"
                      >
                        <Plus className="w-3 h-3 text-slate-600" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="flex items-center gap-1.5 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 sticky top-32">
            <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({cartCount} items)</span>
                <span className="font-semibold text-slate-900">₹{cartTotal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (18%)</span>
                <span className="font-semibold text-slate-900">₹{tax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                {shipping === 0 ? (
                  <span className="font-semibold text-slate-900">Free</span>
                ) : (
                  <span className="font-semibold text-slate-900">₹{shipping.toLocaleString('en-IN')}</span>
                )}
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-slate-900 text-lg">Total</span>
                <span className="font-extrabold text-slate-900 text-2xl">₹{finalTotal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 group transition-all"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-green-500" /> Safe and secure payments
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
