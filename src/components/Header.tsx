import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, User, MapPin, Heart, List as ListIcon, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

type AccountRole = 'CUSTOMER' | 'SELLER';

export default function Header() {
  const { cartCount } = useCart();
  const { user, logout, login, loginWithEmail, registerWithEmail, becomeSeller } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authRole, setAuthRole] = useState<AccountRole>('CUSTOMER');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuth = (role: AccountRole, mode: 'login' | 'register' = 'login') => {
    setAuthRole(role);
    setAuthMode(mode);
    setAuthError('');
    setIsAuthOpen(true);
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
    setAuthEmail('');
    setAuthPassword('');
    setAuthError('');
  };

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      if (authMode === 'register') {
        await registerWithEmail(authEmail, authPassword, authRole);
      } else {
        await loginWithEmail(authEmail, authPassword, authRole);
      }
      closeAuth();
    } catch (error) {
      const code = (error as { code?: string }).code;
      const messages: Record<string, string> = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-credential': 'Email or password is incorrect.',
        'auth/invalid-email': 'Enter a valid email address.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/user-not-found': 'No account was found with this email.',
      };
      setAuthError(messages[code || ''] || 'Unable to complete authentication. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSellerCenter = async () => {
    if (!user) {
      openAuth('SELLER');
      return;
    }
    if (user.role !== 'SELLER') {
      await becomeSeller();
    }
    navigate('/dashboard/seller');
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
            <button onClick={handleSellerCenter} className="hover:text-white transition-colors">Seller Center</button>
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
                  <button onClick={() => openAuth('CUSTOMER', 'register')} className="bg-slate-900 text-white w-full py-2 rounded font-medium hover:bg-slate-800 text-sm">Buyer login / register</button>
                  <button onClick={() => openAuth('SELLER', 'register')} className="bg-slate-100 text-slate-900 w-full py-2 rounded font-medium hover:bg-slate-200 text-sm border border-slate-200">Seller login / register</button>
                </div>
              ) : (
                <div className="p-2">
                  <Link to={`/dashboard/${user.role.toLowerCase()}`} className="block px-4 py-2 hover:bg-slate-50 rounded text-sm font-medium">Dashboard</Link>
                  {user.role !== 'SELLER' && <button onClick={becomeSeller} className="block w-full text-left px-4 py-2 hover:bg-slate-50 rounded text-sm font-medium">Start selling</button>}
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

      {isAuthOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-4" onClick={closeAuth}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">ASTOMITY account</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">{authMode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
                <p className="mt-1 text-sm text-slate-500">{authRole === 'SELLER' ? 'Seller account' : 'Buyer account'}</p>
              </div>
              <button type="button" onClick={closeAuth} className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Close account dialog">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
              {(['CUSTOMER', 'SELLER'] as AccountRole[]).map((role) => (
                <button key={role} type="button" onClick={() => setAuthRole(role)} className={`rounded-md py-2 text-sm font-semibold transition-colors ${authRole === role ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                  {role === 'CUSTOMER' ? 'Buyer' : 'Seller'}
                </button>
              ))}
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Email address
                <input type="email" required autoComplete="email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900" placeholder="you@example.com" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Password
                <input type="password" required minLength={6} autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900" placeholder="At least 6 characters" />
              </label>
              {authError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{authError}</p>}
              <button type="submit" disabled={authLoading} className="w-full rounded-lg bg-slate-900 py-3 font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                {authLoading ? 'Please wait...' : authMode === 'login' ? `Login as ${authRole === 'SELLER' ? 'seller' : 'buyer'}` : `Create ${authRole === 'SELLER' ? 'seller' : 'buyer'} account`}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
              {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button type="button" onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }} className="font-semibold text-slate-900 hover:underline">
                {authMode === 'login' ? 'Create one' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
