import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, MapPin, Heart, List as ListIcon, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const { cartCount } = useCart();
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    'Mobiles', 'Electronics', 'Fashion', 'Men', 'Women', 'Beauty', 'Grocery', 'Sports', 'Books', 'Toys', 'Deals'
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white text-slate-900 shadow-sm border-b border-slate-200">
      
      {/* Top Black Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
            <MapPin className="w-3.5 h-3.5" />
            <span>Deliver to <strong className="text-white">New Delhi, 110001</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard/seller" className="hover:text-white transition-colors">Seller Center</Link>
            <span className="text-slate-600">|</span>
            <Link to="/support" className="hover:text-white transition-colors">Customer Support</Link>
            <span className="text-slate-600">|</span>
            <Link to="/track" className="hover:text-white transition-colors">Track Order</Link>
            <span className="text-slate-600">|</span>
            <Link to="/app" className="hover:text-white transition-colors">Download App</Link>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex flex-col group mr-2">
          <div className="flex items-center gap-1">
            <span className="text-3xl font-bold tracking-tight">ASTOMITY</span>
          </div>
          <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-[-2px]">Everything You Need, One Marketplace.</span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-4xl items-center gap-2">
          <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded text-sm font-medium hover:bg-slate-800 transition-colors">
            <ListIcon className="w-4 h-4" /> All Categories
          </button>
          
          <form onSubmit={handleSearch} className="flex-1 flex relative h-10 border border-slate-300 rounded overflow-hidden bg-white focus-within:border-slate-500 focus-within:ring-1 focus-within:ring-slate-500">
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              className="flex-1 px-4 text-slate-900 outline-none w-full text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="border-l border-slate-300 flex items-center">
              <select className="bg-white text-slate-600 text-sm px-2 py-1 outline-none cursor-pointer border-none max-w-[80px]">
                <option>All</option>
                <option>Mobiles</option>
              </select>
            </div>
            <button type="submit" className="bg-slate-900 px-5 flex items-center justify-center hover:bg-slate-800 transition-colors">
              <Search className="w-4 h-4 text-white" />
            </button>
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Auth / Account */}
          <div className="relative group flex items-center gap-2 cursor-pointer">
            <User className="w-6 h-6 text-slate-700" />
            <div className="hidden lg:flex flex-col">
              {user ? (
                <>
                  <span className="text-[10px] text-slate-500 leading-none">Hello, {user.name.split(' ')[0]}</span>
                  <span className="text-sm font-bold leading-tight text-slate-900">My Account</span>
                </>
              ) : (
                <>
                  <span className="text-[10px] text-slate-500 leading-none">Login / Register</span>
                  <span className="text-sm font-bold leading-tight text-slate-900">My Account</span>
                </>
              )}
            </div>
            
            <div className="absolute top-full right-0 w-48 bg-white text-slate-800 shadow-xl rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden border border-slate-200 mt-2">
              {!user ? (
                <div className="p-4 flex flex-col gap-2">
                  <button onClick={() => login()} className="bg-slate-900 text-white w-full py-2 rounded font-medium hover:bg-slate-800 text-sm">Sign in Customer</button>
                  <button onClick={() => login()} className="bg-slate-100 text-slate-900 w-full py-2 rounded font-medium hover:bg-slate-200 text-sm border border-slate-200">Sign in Seller</button>
                </div>
              ) : (
                <div className="p-2">
                  <Link to={`/dashboard/${user.role.toLowerCase()}`} className="block px-4 py-2 hover:bg-slate-50 rounded text-sm font-medium">Dashboard</Link>
                  <button onClick={logout} className="text-red-600 w-full text-left font-medium hover:bg-red-50 px-4 py-2 rounded text-sm">Sign Out</button>
                </div>
              )}
            </div>
          </div>

          {/* Wishlist */}
          <Link to="/dashboard/customer" className="hidden sm:flex items-center gap-2 cursor-pointer group">
             <Heart className="w-6 h-6 text-slate-700 group-hover:text-slate-900" />
             <span className="font-bold text-sm hidden lg:block text-slate-900">Wishlist</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="flex items-center gap-2 cursor-pointer group">
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-slate-700 group-hover:text-slate-900" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="font-bold text-sm hidden lg:block text-slate-900">Cart</span>
          </Link>
          
          <button className="lg:hidden p-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="w-6 h-6 text-slate-900" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="flex relative h-10 border border-slate-300 rounded overflow-hidden bg-white w-full">
          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 px-4 text-slate-900 outline-none w-full text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="bg-slate-900 px-4 flex items-center justify-center">
            <Search className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>

      {/* Categories Bar */}
      <div className="bg-white border-t border-slate-100 hidden lg:block">
        <div className="container mx-auto px-4 h-12 flex items-center justify-center gap-8 overflow-x-auto hide-scrollbar whitespace-nowrap font-medium text-sm text-slate-700">
          {categories.map((cat, idx) => (
            <Link key={idx} to={`/search?category=${cat}`} className="hover:text-black hover:font-bold transition-all px-2 py-1">
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 0.5 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }} 
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white z-50 shadow-2xl flex flex-col lg:hidden"
            >
              <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <User className="w-8 h-8" />
                  <span className="font-bold text-lg">{user ? `Hello, ${user.name}` : 'Sign In'}</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-slate-300" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-6 py-2">
                  <h3 className="font-bold text-slate-900 text-lg mb-3">Categories</h3>
                  <ul className="space-y-4 text-slate-600 font-medium">
                    {categories.map((cat, i) => (
                      <li key={i}><Link to={`/search?category=${cat}`} onClick={() => setIsMobileMenuOpen(false)}>{cat}</Link></li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
