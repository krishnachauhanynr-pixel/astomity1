import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PackageSearch, TrendingUp, Users, DollarSign, Plus, X, Image as ImageIcon } from 'lucide-react';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    mrp: '',
    category: 'Electronics',
    image: ''
  });

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/seller/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          mrp: parseFloat(formData.mrp || formData.price),
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', brand: '', price: '', mrp: '', category: 'Electronics', image: '' });
        fetchProducts();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Total Sales", value: "₹1,24,450", trend: "+15%", icon: <DollarSign /> },
    { label: "Active Orders", value: "45", trend: "+5%", icon: <PackageSearch /> },
    { label: "Total Products", value: products.length.toString(), trend: "+12%", icon: <TrendingUp /> },
    { label: "Customer Views", value: "8.2k", trend: "+22%", icon: <Users /> },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Seller Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {user?.name || user?.email}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium mb-1">{s.label}</p>
              <h3 className="text-2xl font-bold text-slate-900">{s.value}</h3>
              <span className={`text-xs font-semibold ${s.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{s.trend} this month</span>
            </div>
            <div className="bg-slate-50 text-slate-900 p-4 rounded-xl">
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-6">My Added Products</h3>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <PackageSearch className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">You haven't added any products yet.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-slate-900 font-bold hover:underline"
            >
              Add your first product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-sm text-slate-500">
                  <th className="py-3 px-4 font-medium">Image</th>
                  <th className="py-3 px-4 font-medium">Product Name</th>
                  <th className="py-3 px-4 font-medium">Category</th>
                  <th className="py-3 px-4 font-medium">Price</th>
                  <th className="py-3 px-4 font-medium">Added On</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg p-1 border border-slate-200">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-900">{product.name}</td>
                    <td className="py-4 px-4 text-slate-600">{product.category}</td>
                    <td className="py-4 px-4 font-bold text-slate-900">₹{product.price.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-4 text-slate-500">{new Date(product.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-slate-100 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-slate-900">Add New Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none" 
                  placeholder="e.g. Sony WH-1000XM5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                <input 
                  required
                  type="text" 
                  value={formData.brand}
                  onChange={e => setFormData({...formData, brand: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none" 
                  placeholder="e.g. Sony"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price (₹)</label>
                  <input 
                    required
                    type="number" 
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none" 
                    placeholder="29990"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">MRP (₹)</label>
                  <input 
                    type="number" 
                    value={formData.mrp}
                    onChange={e => setFormData({...formData, mrp: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none" 
                    placeholder="34990"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none"
                >
                  <option>Mobiles</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Men</option>
                  <option>Women</option>
                  <option>Beauty</option>
                  <option>Grocery</option>
                  <option>Sports</option>
                  <option>Books</option>
                  <option>Toys</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> Image URL
                </label>
                <input 
                  required
                  type="url" 
                  value={formData.image}
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-900 outline-none" 
                  placeholder="https://images.unsplash.com/photo-..."
                />
                {formData.image && (
                  <div className="mt-3 w-32 h-32 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center p-2">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-contain mix-blend-multiply" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
