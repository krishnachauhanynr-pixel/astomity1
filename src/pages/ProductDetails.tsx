import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Truck, ShieldCheck, Share2, Heart, Check, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { ProductStructuredData, BreadcrumbStructuredData } from '../components/StructuredData';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          navigate('/search');
        } else {
          setProduct(data);
          setActiveImage(data.image);
        }
        setLoading(false);
      });
  }, [id, navigate]);

  if (loading || !product) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div></div>;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductStructuredData product={product} />
      <BreadcrumbStructuredData items={[
        { name: 'Home', url: '/' },
        { name: product.category, url: `/search?category=${encodeURIComponent(product.category)}` },
        { name: product.name, url: `/product/${product.id}` }
      ]} />

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to results
      </button>

      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-12">
        
        {/* Images Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
            {[1, 2, 3, 4].map((i) => (
              <button 
                key={i} 
                onClick={() => setActiveImage(product.image)}
                className={`w-20 h-20 rounded-xl border-2 p-2 flex-shrink-0 transition-all ${activeImage === product.image ? 'border-slate-900' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <img src={product.image} alt="Thumbnail" className="w-full h-full object-contain mix-blend-multiply" />
              </button>
            ))}
          </div>
          <div className="flex-1 bg-slate-50 rounded-2xl p-8 flex items-center justify-center relative group">
            <img src={activeImage} alt={product.name} className="w-full max-h-[500px] object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105" />
            <button className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-sm hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="absolute top-16 right-4 p-3 bg-white rounded-full shadow-sm hover:text-slate-500 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="mb-2 text-slate-500 font-bold tracking-wider text-sm uppercase">{product.brand}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center bg-slate-100 px-3 py-1 rounded-full">
              <Star className="w-4 h-4 text-slate-900 fill-current mr-1.5" />
              <span className="font-bold text-slate-900 mr-1">{product.rating}</span>
            </div>
            <span className="text-slate-500 text-sm">{product.reviews.toLocaleString('en-IN')} verified ratings</span>
          </div>

          <div className="mb-8">
            <div className="flex items-end gap-3 mb-2">
              <span className="text-4xl font-extrabold text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-lg text-slate-400 line-through mb-1">₹{product.mrp.toLocaleString('en-IN')}</span>
                  <span className="bg-slate-900 text-white px-2 py-0.5 rounded text-sm font-bold mb-1">({product.discount}% OFF)</span>
                </>
              )}
            </div>
            <p className="text-sm text-slate-500">Inclusive of all taxes</p>
          </div>

          <div className="mb-8 space-y-4">
            <h3 className="font-bold text-slate-900">Delivery Options</h3>
            <div className="flex gap-4">
              <input type="text" placeholder="Enter Pincode" className="border border-slate-300 rounded-lg px-4 py-2 flex-1 focus:ring-2 focus:ring-slate-900 outline-none" />
              <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">Check</button>
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
              <Truck className="w-4 h-4" /> Free delivery by tomorrow, {new Date(Date.now() + 86400000).toLocaleDateString()}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-slate-900 mb-4">Quantity</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all"
                >
                  <Minus className="w-4 h-4 text-slate-600" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <span className="text-sm text-slate-500">Only {Math.floor(Math.random() * 20) + 5} items left in stock!</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-8">
            <button 
              onClick={handleAddToCart}
              className="flex-1 border-2 border-slate-900 text-slate-900 hover:bg-slate-50 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
            >
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-slate-900 text-white hover:bg-slate-800 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Buy Now
            </button>
          </div>
          
          <div className="mt-8 flex gap-6 border-t border-slate-100 pt-6">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <ShieldCheck className="w-5 h-5 text-slate-900" /> 1 Year Warranty
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Check className="w-5 h-5 text-slate-900" /> 100% Original
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specifications Tabs */}
      <div className="mt-12 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Product Details</h2>
        <div className="prose prose-slate max-w-none">
          <p>
            Experience the ultimate performance with the new {product.name}. Designed for professionals and enthusiasts alike, 
            this premium product from {product.brand} delivers exceptional quality and reliability.
          </p>
          <ul className="mt-6 space-y-2">
            <li><strong>Brand:</strong> {product.brand}</li>
            <li><strong>Category:</strong> {product.category}</li>
            <li><strong>Model Year:</strong> 2026</li>
            <li><strong>Manufacturer:</strong> {product.brand} Inc.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
