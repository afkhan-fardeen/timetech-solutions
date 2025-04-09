// app/products/[id]/page.js
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSession } from '../../../lib/SessionContext';
import Header from '../../../components/Header';

export default function ProductPage() {
  const { session } = useSession();
  const [product, setProduct] = useState(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    setProduct(data || null);
  };

  const addToCart = async () => {
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
      .eq('product_id', id)
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
        .insert([{ cart_id: cart.id, product_id: id, quantity: 1 }]);
      toast.success('Added to your cart!');
    }
  };

  if (!product) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-apple-gray">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 px-4 sm:px-6 pb-16 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <img
              src={product.image_url || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-80 object-cover rounded-2xl shadow-md"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-apple-black tracking-tight mb-3">
                {product.name}
              </h1>
              <p className="text-apple-gray text-sm mb-4">
                {product.description || 'A premium product crafted with precision.'}
              </p>
              <p className="text-xl font-semibold text-apple-black tracking-tight mb-6">
                {product.price.toFixed(2)} BHD
              </p>
            </div>
            <div>
              <button
                onClick={addToCart}
                className="w-full bg-apple-black text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md text-sm"
              >
                Add to Cart
              </button>
              <button
                onClick={() => router.push('/products')}
                className="w-full mt-3 text-apple-blue hover:text-apple-blueHover font-medium text-sm"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}