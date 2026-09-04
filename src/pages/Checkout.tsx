import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, MapPin, CreditCard, Lock, ChevronRight } from 'lucide-react';

export default function Checkout() {
  const { items, cartTotal, removeFromCart } = useCart();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ name: '', street: '', city: '', zip: '' });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Redirect if cart is empty
  if (items.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  const tax = cartTotal * 0.18;
  const shipping = cartTotal > 50 ? 0 : 15;
  const finalTotal = cartTotal + tax + shipping;

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setOrderPlaced(true);
      // Empty cart simulation
      items.forEach(item => removeFromCart(item.product.id));
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-slate-500 mb-8 max-w-md">Thank you for shopping at ASTOMITY. Your order ID is #ORD-{Math.floor(Math.random() * 100000)}.</p>
        <Link to="/" className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:-translate-y-0.5 transition-all">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Checkout Steps */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          
          {/* Step 1: Authentication */}
          <div className={`bg-white rounded-2xl p-6 shadow-sm border ${step === 1 ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>1</span>
                Account
              </h2>
              {step > 1 && <button onClick={() => setStep(1)} className="text-slate-900 text-sm font-medium">Change</button>}
            </div>
            
            {step === 1 && (
              <div className="pl-11">
                {user ? (
                  <div>
                    <p className="mb-4">Logged in as <span className="font-semibold">{user.email}</span></p>
                    <button onClick={() => setStep(2)} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium">Continue</button>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <p className="mb-4 text-slate-800">Please sign in to proceed with your order.</p>
                    <button onClick={() => login()} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium">Sign in as Demo Customer</button>
                  </div>
                )}
              </div>
            )}
            {step > 1 && user && <p className="pl-11 text-slate-500">{user.email}</p>}
          </div>

          {/* Step 2: Address */}
          <div className={`bg-white rounded-2xl p-6 shadow-sm border ${step === 2 ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200'} ${step < 2 && 'opacity-50 pointer-events-none'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 2 ? 'bg-slate-900 text-white' : step > 2 ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                </span>
                Delivery Address
              </h2>
              {step > 2 && <button onClick={() => setStep(2)} className="text-slate-900 text-sm font-medium">Change</button>}
            </div>
            
            {step === 2 && (
              <div className="pl-11 space-y-4 max-w-lg">
                <input type="text" placeholder="Full Name" value={address.name} onChange={e=>setAddress({...address, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none" />
                <input type="text" placeholder="Street Address" value={address.street} onChange={e=>setAddress({...address, street: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none" />
                <div className="flex gap-4">
                  <input type="text" placeholder="City" value={address.city} onChange={e=>setAddress({...address, city: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none" />
                  <input type="text" placeholder="PIN Code" value={address.zip} onChange={e=>setAddress({...address, zip: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none" />
                </div>
                <button onClick={() => { if(address.name && address.street) setStep(3) }} className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium mt-2">Deliver Here</button>
              </div>
            )}
            {step > 2 && <p className="pl-11 text-slate-500 flex items-center gap-2"><MapPin className="w-4 h-4" /> {address.name}, {address.street}, {address.city} - {address.zip}</p>}
          </div>

          {/* Step 3: Payment */}
          <div className={`bg-white rounded-2xl p-6 shadow-sm border ${step === 3 ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200'} ${step < 3 && 'opacity-50 pointer-events-none'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 3 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>3</span>
                Payment Method
              </h2>
            </div>
            
            {step === 3 && (
              <div className="pl-11">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-sm text-slate-800 flex items-start gap-3">
                  <Lock className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-600" />
                  <div>
                    <strong>Payment Gateway Mocked</strong><br/>
                    This is a preview environment. Do not enter real credit card details. Select a payment method below to simulate the transaction.
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {['card', 'upi', 'cod'].map((method) => (
                    <label key={method} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === method ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-slate-900 focus:ring-slate-900" />
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 capitalize">
                          {method === 'card' ? 'Credit / Debit Card' : method === 'upi' ? 'UPI' : 'Cash on Delivery'}
                        </div>
                      </div>
                      {method === 'card' && <CreditCard className="w-5 h-5 text-slate-400" />}
                    </label>
                  ))}
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {isProcessing ? 'Processing...' : `Pay ₹${finalTotal.toLocaleString('en-IN', {maximumFractionDigits: 0})}`}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-32">
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-4 border-b border-slate-100">Order Items</h3>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-3 text-sm">
                  <div className="w-12 h-12 bg-slate-50 rounded flex-shrink-0 p-1">
                    <img src={item.product.image} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 line-clamp-2 leading-tight">{item.product.name}</div>
                    <div className="text-slate-500 mt-1">Qty: {item.quantity} x ₹{item.product.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-4 border-b border-slate-100">Price Details</h3>
            <div className="space-y-3 mb-6 text-slate-600 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-4 flex justify-between items-center font-bold text-lg text-slate-900">
              <span>Total Pay</span>
              <span>₹{finalTotal.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
