import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Percent, Zap, Truck, ShieldCheck, CreditCard, Smartphone, Tv, Shirt, User, Heart, Coffee, Box, Dribbble, Book, Gamepad, Car } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FAQ from '../components/FAQ';
import { OrganizationStructuredData } from '../components/StructuredData';
import { useSEO } from '../hooks/useSEO';
import { Product } from '../types';

export default function Home() {
  
  useSEO({
    title: 'ASTOMITY – Online Shopping in India | Mobiles, Electronics, Fashion & More',
    description: 'Shop online at ASTOMITY for mobiles, electronics, fashion, beauty, grocery, home & kitchen, books, toys and more. Discover products, deals and offers online.',
    keywords: 'online shopping India, online shopping site India, buy products online India, best online shopping site, ASTOMITY, ASTOMITY shopping, ASTOMITY online shopping'
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(res => res.json()),
      fetch('/api/products/deals').then(res => res.json())
    ]).then(([allProducts, dealsData]) => {
      setProducts(allProducts);
      setDeals(dealsData);
      setLoading(false);
    });
  }, []);

  const topCategories = [
    { name: 'Mobiles', icon: <Smartphone className="w-8 h-8" /> },
    { name: 'Electronics', icon: <Tv className="w-8 h-8" /> },
    { name: 'Fashion', icon: <Shirt className="w-8 h-8" /> },
    { name: 'Men', icon: <User className="w-8 h-8" /> },
    { name: 'Women', icon: <Heart className="w-8 h-8" /> },
    { name: 'Beauty', icon: <Box className="w-8 h-8" /> },
    { name: 'Grocery', icon: <Box className="w-8 h-8" /> },
    { name: 'Sports', icon: <Dribbble className="w-8 h-8" /> },
    { name: 'Books', icon: <Book className="w-8 h-8" /> },
    { name: 'Toys', icon: <Gamepad className="w-8 h-8" /> },
    { name: 'Automotive', icon: <Car className="w-8 h-8" /> },
  ];

  const features = [
    { icon: <Truck className="w-6 h-6" />, title: "Free Delivery", desc: "On orders above ₹499" },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Easy Returns", desc: "10-day return policy" },
    { icon: <CreditCard className="w-6 h-6" />, title: "Secure Payment", desc: "100% secure payments" },
    { icon: <Zap className="w-6 h-6" />, title: "Best Price", desc: "Guaranteed best price" },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>;
  }

  return (
    <div className="flex flex-col gap-12 pb-12">
      <OrganizationStructuredData />
      {/* Hero Section */}
      <section className="container mx-auto px-4 mt-4">
        <div className="bg-[#111317] rounded-2xl overflow-hidden relative min-h-[450px] md:min-h-[500px] flex items-center shadow-lg">
          <div className="absolute inset-0 z-0 flex justify-end">
            <div className="w-full md:w-3/5 h-full relative">
              <img 
                src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=2000" 
                alt="ASTOMITY Products" 
                className="w-full h-full object-cover object-right opacity-40 md:opacity-80 mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111317] via-[#111317]/80 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-transparent to-transparent md:hidden"></div>
            </div>
          </div>
          
          <div className="relative z-10 px-8 md:px-16 max-w-2xl lg:max-w-3xl">
            <div className="text-sm md:text-base font-bold text-slate-400 mb-3 uppercase tracking-widest">WELCOME TO ASTOMITY</div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              Online Shopping in India – Shop Mobiles, Electronics, Fashion & More
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-lg font-medium">
              Everything You Need, One Marketplace.
            </p>
          </div>
        </div>
      </section>

      {/* Circle Categories */}
      <section className="container mx-auto px-4">
        <div className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar pb-4 snap-x">
          {topCategories.map((cat, i) => (
            <Link key={i} to={`/search?category=${encodeURIComponent(cat.name)}`} className="flex flex-col items-center gap-3 min-w-[80px] snap-center group">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-200 transition-colors">
                {cat.icon}
              </div>
              <span className="text-xs font-bold text-slate-800 text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale / Deals */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Best Deals on ASTOMITY</h2>
          <Link to="/search?deals=true" className="flex items-center gap-1 font-bold text-slate-900 hover:underline transition-all">
            View All <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {deals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features Bar */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          {features.map((feature, i) => (
            <div key={i} className="p-4 flex flex-col xl:flex-row items-center gap-4 text-center xl:text-left">
              <div className="text-slate-900">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{feature.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-100 rounded-xl p-8 flex flex-col justify-center items-start">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">EXTRA 10% OFF</h3>
            <p className="text-slate-600 mb-6 font-medium">On Your First Order</p>
            <button className="bg-slate-900 text-white px-6 py-2.5 rounded text-sm font-bold hover:bg-slate-800 transition-colors">Use Code: ASTO10</button>
          </div>
          <div className="bg-slate-100 rounded-xl p-8 flex flex-col justify-center items-start relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Up to 60% OFF</h3>
              <p className="text-slate-600 mb-6 font-medium">On Fashion</p>
              <Link to="/search?category=Fashion" className="bg-slate-900 text-white px-6 py-2.5 rounded text-sm font-bold hover:bg-slate-800 transition-colors inline-block">Shop Now</Link>
            </div>
          </div>
          <div className="bg-slate-100 rounded-xl p-8 flex flex-col justify-center items-start">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">New Arrivals</h3>
            <p className="text-slate-600 mb-6 font-medium">Latest Products</p>
            <Link to="/search" className="bg-slate-900 text-white px-6 py-2.5 rounded text-sm font-bold hover:bg-slate-800 transition-colors inline-block">Explore Now</Link>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Popular Products</h2>
          <Link to="/search" className="flex items-center gap-1 font-bold text-slate-900 hover:underline transition-all">
            View All <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.slice(0, 5).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      
      {/* Category SEO Content */}
      <section className="container mx-auto px-4 pt-8 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm text-slate-600">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Shop Mobiles Online</h2>
            <p>Discover the latest smartphones and mobile accessories at unbeatable prices. From premium flagship devices to affordable 5G smartphones under ₹15000, ASTOMITY offers the best mobile deals in India.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Electronics at Great Prices</h2>
            <p>Upgrade your tech lifestyle with our vast selection of electronics. Buy laptops, wireless earbuds, smartwatches, and bluetooth speakers online with exclusive discounts and offers.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Fashion for Men & Women</h2>
            <p>Explore the latest trends in men's and women's fashion. Shop for stylish shirts, dresses, ethnic wear, sarees, and footwear online in India with hassle-free returns.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Home & Kitchen Products</h2>
            <p>Transform your living space with our premium home and kitchen products. Find the best kitchen appliances, mixer grinders, and air fryers at the best prices online.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Beauty & Personal Care</h2>
            <p>Shop for top-rated beauty and skincare products online. Browse our curated selection of shampoos, sunscreens, and cosmetics with heavy discounts.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Grocery Shopping Online</h2>
            <p>Experience the convenience of grocery shopping online with fast home delivery. Get the best prices on daily essentials and pantry staples.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Sports & Fitness Products</h2>
            <p>Stay active and fit with premium sports equipment online. Buy cricket gear, badminton rackets, and fitness accessories from top brands.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Books & Toys</h2>
            <p>Discover best-selling books, educational materials for students, and safe, fun toys for kids. Shop for entertainment and learning essentials online.</p>
          </div>
        </div>
      </section>

      <FAQ />
      {/* Newsletter */}
      <section className="bg-slate-900 text-white py-12 mt-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 border border-slate-700 rounded">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Subscribe to our newsletter</h3>
              <p className="text-sm text-slate-400 mt-1">Get the latest updates on new arrivals, deals and offers.</p>
            </div>
          </div>
          <form className="flex w-full md:w-auto gap-2">
            <input type="email" placeholder="Enter your email address" className="bg-transparent border border-slate-700 rounded px-4 py-3 min-w-[250px] outline-none focus:border-white transition-colors" />
            <button type="submit" className="bg-white text-slate-900 font-bold px-6 py-3 rounded hover:bg-slate-100 transition-colors">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
}
