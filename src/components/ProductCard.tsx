import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  key?: React.Key;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-md"
    >
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-slate-50 p-6 flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
          loading="lazy"
        />
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
            {product.discount}% OFF
          </span>
        )}
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-slate-900 text-sm mb-1 line-clamp-2 hover:text-slate-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="text-slate-500 text-xs mb-2">
          {product.category}
        </div>
        
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-slate-900">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-slate-900">{product.rating}</span>
          <span className="text-xs text-slate-500">({product.reviews.toLocaleString('en-IN')})</span>
        </div>
        
        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
              {product.discount > 0 && (
                <span className="text-xs text-slate-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button 
              onClick={() => addToCart(product)}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
