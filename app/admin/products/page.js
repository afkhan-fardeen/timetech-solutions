// app/products/page.js
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSession } from '../../lib/SessionContext';
import FloatingCurrencyButton from '../../components/FloatingCurrencyButton';
import Header from '../components/Header';

export default function Products() {
  const { session } = useSession();
  const [products, setProducts] = useState([]);
  const [currency, setCurrency] = useState('BHD');
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*');
    setProducts(data || []);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20 px-6 pb-12">
        <h2 className="text-5xl font-bold text-apple-black mb-12 text-center tracking-tight">
          Our Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={product.image_url || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-72 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-apple-black tracking-tight">{product.name}</h3>
                <p className="text-apple-gray text-sm mt-2 line-clamp-2">{product.description}</p>
                <p className="text-xl font-medium text-apple-black mt-4 tracking-tight">
                  {product.price.toFixed(2)} {currency}
                </p>
                <button
                  onClick={() => addToCart(product.id)}
                  className="mt-6 w-full bg-apple-black text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FloatingCurrencyButton onCurrencyChange={setCurrency} />
    </div>
  );
}