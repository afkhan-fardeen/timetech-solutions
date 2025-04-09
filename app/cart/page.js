// app/cart/page.js
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSession } from '../../lib/SessionContext';
import FloatingCurrencyButton from '../../components/FloatingCurrencyButton';
import Header from '../../components/Header';

export default function Cart() {
  const { session } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [currency, setCurrency] = useState('BHD');
  const router = useRouter();

  useEffect(() => {
    if (!session) router.push('/login');
    fetchCart();
  }, [session, router]);

  const fetchCart = async () => {
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('customer_id', session.id)
      .single();

    if (!cart) return;

    const { data } = await supabase
      .from('cart_items')
      .select('*, products(name, price, image_url)')
      .eq('cart_id', cart.id);
    setCartItems(data || []);
  };

  const updateQuantity = async (itemId, quantity) => {
    await supabase
      .from('cart_items')
      .update({ quantity: Math.max(1, quantity) })
      .eq('id', itemId);
    toast.success('Quantity updated!');
    fetchCart();
  };

  const removeItem = async (itemId) => {
    await supabase.from('cart_items').delete().eq('id', itemId);
    toast.success('Item removed from cart.');
    fetchCart();
  };

  const total = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 pt-20 px-4 sm:px-6 pb-12 max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-apple-black mb-12 text-center tracking-tight">
          Your Cart
        </h2>
        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-apple-gray text-lg">Your cart is empty.</p>
            <button
              onClick={() => router.push('/products')}
              className="mt-6 bg-apple-black text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md text-sm sm:text-base"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
              >
                <img
                  src={item.products.image_url || '/placeholder.jpg'}
                  alt={item.products.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl"
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-semibold text-apple-black tracking-tight">
                    {item.products.name}
                  </h3>
                  <p className="text-apple-gray text-sm mt-1">
                    {item.products.price.toFixed(2)} {currency}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center border border-gray-200 rounded-xl">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 sm:px-3 py-1 sm:py-2 text-apple-gray hover:text-apple-black"
                    >
                      -
                    </button>
                    <span className="px-3 sm:px-4 py-1 sm:py-2 text-apple-black text-sm sm:text-base">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 sm:px-3 py-1 sm:py-2 text-apple-gray hover:text-apple-black"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 font-medium transition-colors text-sm sm:text-base"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-xl sm:text-2xl font-semibold text-apple-black tracking-tight">
                Total: {total.toFixed(2)} {currency}
              </p>
              <button
                onClick={() => router.push('/checkout')}
                className="bg-apple-black text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md text-sm sm:text-base"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      <FloatingCurrencyButton onCurrencyChange={setCurrency} />
    </div>
  );
}