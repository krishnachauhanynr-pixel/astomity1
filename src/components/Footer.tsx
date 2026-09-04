import { Link } from 'react-router-dom';
import { Hexagon, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          <div>
            <Link to="/" className="flex flex-col group mr-2 mb-6 cursor-pointer">
              <div className="flex items-center gap-1">
                <span className="text-3xl font-bold tracking-tight text-white">ASTOMITY</span>
              </div>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-[-2px]">Everything You Need, One Marketplace.</span>
            </Link>
            <div className="flex gap-4 mb-6">
              <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">About ASTOMITY</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white hover:underline transition-all">About Us</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-all">Careers</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-all">Press Releases</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-all">ASTOMITY Cares</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Customer Service</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white hover:underline transition-all">Help Center</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-all">Returns & Replacements</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-all">Order Tracking</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-all">Shipping Information</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">Make Money with Us</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white hover:underline transition-all">Sell on ASTOMITY</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-all">Seller Dashboard</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-all">Seller Support</a></li>
              <li><a href="#" className="hover:text-white hover:underline transition-all">Advertise Your Products</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
          </div>
          <p>&copy; {new Date().getFullYear()} ASTOMITY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
