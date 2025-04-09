// app/products/page.js
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSession } from '../../lib/SessionContext';
import FloatingCurrencyButton from '../../components/FloatingCurrencyButton';
import Header from '../../components/Header';
import Link from 'next/link';

export default function Products() {
  const { session } = useSession();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currency, setCurrency] = useState('BHD');
  const [filter, setFilter] = useState({ category: '', minPrice: '', maxPrice: '' });
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*'),
      supabase.from('categories').select('*'),
    ]);
    setProducts(productsRes.data || []);
    setCategories(categoriesRes.data || []);
  };

  const applyFilters = () => {
    let filtered = [...products];
    
    // Category filter (handles null category_id)
    if (filter.category) {
      filtered = filtered.filter((p) => p.category_id === parseInt(filter.category));
    }

    // Price filters (handles empty strings and numeric conversion)
    const minPrice = filter.minPrice !== '' ? parseFloat(filter.minPrice) : -Infinity;
    const maxPrice = filter.maxPrice !== '' ? parseFloat(filter.maxPrice) : Infinity;
    filtered = filtered.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    return filtered;
  };

  const addToCart = async (productId) => {
    if (!session) {
      toast.error('Please sign in to add items to your cart.');
      router.push('/login');
      return;
    }

    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('customer_id', session.id)
      .single();

    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id);
      toast.success('Added another to your cart!');
    } else {
      await supabase
        .from('cart_items')
        .insert([{ cart_id: cart.id, product_id: productId, quantity: 1 }]);
      toast.success('Added to your cart!');
    }
  };

  const filteredProducts = applyFilters();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 px-4 sm:px-6 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-apple-black tracking-tight mb-3">
            TimeTech Collection
          </h1>
          <p className="text-lg text-apple-gray max-w-xl mx-auto">
            Crafted for the future. Explore our range.
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto mb-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="w-full sm:w-48 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-apple-black text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={filter.minPrice}
            onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })}
            className="w-full sm:w-32 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-apple-black text-sm"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filter.maxPrice}
            onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
            className="w-full sm:w-32 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-apple-black text-sm"
          />
        </div>

        {/* Product Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-102 transition-transform duration-200"
            >
              <Link href={`/products/${product.id}`}>
                <div className="relative">
                  <img
                    src={product.image_url || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-lg font-semibold text-apple-black tracking-tight mb-1 hover:text-apple-blue transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-apple-gray text-xs line-clamp-1 mb-3">
                  {product.description || 'Designed for excellence.'}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-base font-medium text-apple-black tracking-tight">
                    {product.price.toFixed(2)} {currency}
                  </p>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="bg-apple-black text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-apple-blue transition-all shadow-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <p className="text-center text-apple-gray col-span-full text-sm">
              No products match your filters.
            </p>
          )}
        </div>
      </div>
      <FloatingCurrencyButton onCurrencyChange={setCurrency} />
    </div>
  );
}