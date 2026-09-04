import { useAuth } from '../../context/AuthContext';
import { Package, Heart, MapPin, CreditCard, LogOut } from 'lucide-react';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();

  const menu = [
    { icon: <Package className="w-5 h-5"/>, label: 'My Orders', desc: 'Track, return, or buy things again' },
    { icon: <Heart className="w-5 h-5"/>, label: 'Wishlist', desc: 'View your saved items' },
    { icon: <MapPin className="w-5 h-5"/>, label: 'Addresses', desc: 'Edit delivery addresses' },
    { icon: <CreditCard className="w-5 h-5"/>, label: 'Payment Options', desc: 'Manage saved cards and UPI' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Your Account</h1>
        <button onClick={logout} className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8 flex items-center gap-4">
        <div className="w-16 h-16 bg-slate-100 text-slate-900 rounded-full flex items-center justify-center text-2xl font-bold">
          {user?.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
          <p className="text-slate-500">{user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menu.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 hover:shadow-md cursor-pointer transition-all flex items-start gap-4 group">
            <div className="bg-slate-50 p-3 rounded-xl text-slate-900 group-hover:bg-slate-50 transition-colors">
              {item.icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">{item.label}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
