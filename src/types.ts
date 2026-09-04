export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  discount: number;
  image: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'SELLER' | 'ADMIN';
}
