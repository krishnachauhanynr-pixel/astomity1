import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MapProvider } from './components/maps/MapProvider';
import { CartProvider } from './context/CartContext';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import CanonicalTag from './components/CanonicalTag';

// Pages
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Search from './pages/Search';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CustomerDashboard from './pages/Dashboard/CustomerDashboard';
import SellerDashboard from './pages/Dashboard/SellerDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <MapProvider>
      <CartProvider>
        <BrowserRouter>
          <CanonicalTag />
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="search" element={<Search />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
            </Route>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="customer" element={<CustomerDashboard />} />
              <Route path="seller" element={<SellerDashboard />} />
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </MapProvider>
    </AuthProvider>
  );
}
