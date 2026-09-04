import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, ChevronDown, SlidersHorizontal, LayoutGrid, List } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useSEO } from '../hooks/useSEO';
import { Product } from '../types';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const dealsOnly = searchParams.get('deals') === 'true';

  
  // Determine SEO keywords based on filters
  let seoTitle = 'Search Products | ASTOMITY';
  let seoKeywords = 'online shopping India, online shopping deals';

  if (searchParams.get('deals') === 'true') {
    seoTitle = 'Online Shopping Deals & Offers | ASTOMITY';
    seoKeywords = 'online shopping deals, best deals online India, online shopping offers, discount shopping online, best online deals under ₹500, products under ₹1000 online, discounted products online India';
  } else if (categoryParam) {
    if (categoryParam === 'Mobiles') {
      seoTitle = 'Buy Mobile Phones Online | ASTOMITY';
      seoKeywords = 'buy mobile phones online, mobile phones online India, smartphones at best price, best mobile under 10000, best mobile under 15000, best mobile under 20000, 5G mobile phones online, buy smartphones online at best price India, best 5G smartphone under ₹20000, affordable smartphones under ₹15000';
    } else if (categoryParam === 'Electronics') {
      seoTitle = 'Buy Electronics Online | ASTOMITY';
      seoKeywords = 'buy electronics online, electronics online India, best electronics deals, buy laptops online India, laptop deals online, wireless earbuds online, bluetooth speakers online, smart watch online India, power bank online, buy wireless earbuds under ₹2000, best bluetooth speaker under ₹5000, buy smartwatch under ₹3000, best laptop for students under ₹40000';
    } else if (categoryParam === 'Fashion') {
      seoTitle = 'Fashion Shopping Online | ASTOMITY';
      seoKeywords = 'buy clothes online India, fashion shopping online';
    } else if (categoryParam === 'Men') {
      seoTitle = "Men's Clothing Online | ASTOMITY";
      seoKeywords = "men's clothing online, men's shirts online, men's shoes online, buy men's shirts online under ₹1000, men's sneakers under ₹2000";
    } else if (categoryParam === 'Women') {
      seoTitle = "Women's Fashion Online | ASTOMITY";
      seoKeywords = "women's clothing online, women's fashion online, women's dresses online, sarees online India, women's dresses under ₹1500, women's ethnic wear online India, buy sarees online at best price";
    } else if (categoryParam === 'Beauty') {
      seoTitle = 'Beauty Products Online | ASTOMITY';
      seoKeywords = 'beauty products online India, skincare products online, shampoo online India, sunscreen online India, skincare products under ₹1000, sunscreen SPF 50 online India, beauty products at discount';
    } else if (categoryParam === 'Grocery') {
      seoTitle = 'Grocery Shopping Online | ASTOMITY';
      seoKeywords = 'grocery shopping online, grocery online India, buy groceries online, grocery products online at best price, online grocery shopping with home delivery';
    } else if (categoryParam === 'Sports') {
      seoTitle = 'Sports Products Online | ASTOMITY';
      seoKeywords = 'sports products online, sports equipment online, cricket products online, cricket equipment online India, badminton rackets online';
    } else if (categoryParam === 'Books') {
      seoTitle = 'Buy Books Online | ASTOMITY';
      seoKeywords = 'books online India, buy books online, educational books online, books for students online India, best selling books online India';
    } else if (categoryParam === 'Toys') {
      seoTitle = 'Toys Online India | ASTOMITY';
      seoKeywords = 'toys online India, kids toys online, educational toys for kids online, toys under ₹1000 online';
    }
  }

  useSEO({
    title: seoTitle,
    keywords: seoKeywords
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid');

  useEffect(() => {
    // In a real app, we'd pass query params to the backend. 
    // Here we fetch all and filter on the client for demo purposes.
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        let filtered = data as Product[];
        
        if (query) {
          filtered = filtered.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()));
        }
        if (categoryParam && categoryParam !== 'All Categories') {
          filtered = filtered.filter(p => p.category === categoryParam);
        }
        if (dealsOnly) {
          filtered = filtered.filter(p => p.discount > 0);
        }
        
        setProducts(filtered);
        setLoading(false);
      });
  }, [query, categoryParam, dealsOnly]);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      
      {/* Filters Sidebar - Desktop */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 sticky top-32">
          <div className="flex items-center gap-2 font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
            <SlidersHorizontal className="w-5 h-5" /> Filters
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {['Mobiles', 'Electronics', 'Fashion', 'Men', 'Women', 'Beauty', 'Grocery', 'Sports', 'Books', 'Toys', 'Deals'].map(cat => (
                <li key={cat}>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded text-slate-900 focus:ring-slate-900 w-4 h-4 border-slate-300" defaultChecked={cat === categoryParam} />
                    <span className="group-hover:text-slate-900 transition-colors">{cat}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Price Range</h3>
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Min" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-slate-900" />
              <span>-</span>
              <input type="number" placeholder="Max" className="w-full border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:border-slate-900" />
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Customer Rating</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {[4, 3, 2, 1].map(rating => (
                <li key={rating}>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded text-slate-900 focus:ring-slate-900 w-4 h-4 border-slate-300" />
                    <span className="flex items-center group-hover:text-slate-900 transition-colors">
                      {rating}★ & above
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {query ? `Results for "${query}"` : categoryParam ? categoryParam : dealsOnly ? 'Today\'s Deals' : 'All Products'}
            </h1>
            <p className="text-sm text-slate-500">{products.length} products found</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="md:hidden flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-medium">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Sort by:</span>
              <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-slate-900 cursor-pointer">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
            <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}><LayoutGrid className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div></div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No products found</h2>
            <p className="text-slate-500 mb-6">Try adjusting your filters or search for something else.</p>
            <Link to="/" className="text-slate-900 font-semibold hover:underline">Go back home</Link>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
