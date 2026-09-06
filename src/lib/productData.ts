import { Product } from '../types';
import bundledProducts from '../data/products.json';

type CatalogProduct = Omit<Product, 'id'> & { id?: number };

function normalizeProduct(product: CatalogProduct, index: number): Product {
  return {
    ...product,
    id: product.id ?? index + 1,
    price: Number(product.price),
    mrp: Number(product.mrp),
    rating: Number(product.rating),
    reviews: Number(product.reviews),
    discount: Number(product.discount),
  };
}

export async function loadProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error(`Product API returned ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Product API returned an invalid response');
    }

    if (data.length === 0) {
      throw new Error('Product API returned no products');
    }

    return data.map(normalizeProduct);
  } catch (error) {
    console.warn('Using bundled product catalog:', error);
    return (bundledProducts as CatalogProduct[]).map(normalizeProduct);
  }
}

export async function loadProduct(id: string): Promise<Product | undefined> {
  try {
    const response = await fetch(`/api/products/${id}`);
    if (response.ok) {
      const data = await response.json();
      return normalizeProduct(data, 0);
    }
  } catch (error) {
    console.warn('Product API unavailable:', error);
  }

  const products = await loadProducts();
  return products.find(product => String(product.id) === id);
}
