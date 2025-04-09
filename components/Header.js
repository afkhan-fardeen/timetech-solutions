'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { useSession } from '../lib/SessionContext';
import { Toaster } from 'react-hot-toast';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { session } = useSession();

  useEffect(() => {
    if (!session) {
      setCartCount(0);
      return;
    }

    const fetchCartCount = async () => {
      const { data: cart, error: cartError } = await supabase
        .from('carts')
        .select('id')
        .eq('customer_id', session.id)
        .single();

      if (cartError && cartError.code !== 'PGRST116') {
        console.error('Cart fetch error:', cartError);
        setCartCount(0);
        return;
      }

      if (!cart) {
        setCartCount(0);
        return;
      }

      const { data: items, error: itemsError } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('cart_id', cart.id);

      if (itemsError) {
        console.error('Items fetch error:', itemsError);
        setCartCount(0);
        return;
      }

      const total = items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(total);
    };

    fetchCartCount();

    const channel = supabase
      .channel(`cart_changes_${session.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `cart_id=eq.${session.id}`,
        },
        () => fetchCartCount()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  return (
    <header className="fixed top-0 w-full bg-apple-light/90 backdrop-blur-md shadow-apple z-10">
      <Toaster position="top-right" toastOptions={{ style: { borderRadius: '980px', background: '#1d1d1f', color: '#fff' } }} />
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold text-apple-black tracking-tight">
          TimeTech
        </Link>

        <div className="hidden md:flex space-x-10 items-center">
          <Link href="/products" className="text-apple-gray hover:text-apple-black transition-colors">Products</Link>
          <Link href="/about" className="text-apple-gray hover:text-apple-black transition-colors">About</Link>
          <Link href="/contact" className="text-apple-gray hover:text-apple-black transition-colors">Contact</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="text-apple-gray hover:text-apple-black transition-colors">Dashboard</Link>
              <Link href="/cart" className="relative">
                <span className="text-apple-gray hover:text-apple-black transition-colors">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-apple-black text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <Link href="/login" className="text-apple-blue hover:text-apple-blueHover transition-colors">Sign In</Link>
          )}
        </div>

        <div className="flex items-center md:hidden">
          <Link href="/cart" className="relative mr-4">
            <span className="text-apple-gray hover:text-apple-black transition-colors">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-apple-black text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-apple-black focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-apple-light md:hidden">
            <div className="flex flex-col items-center py-4 space-y-4">
              <Link href="/products" className="text-apple-gray hover:text-apple-black transition-colors" onClick={() => setMenuOpen(false)}>Products</Link>
              <Link href="/about" className="text-apple-gray hover:text-apple-black transition-colors" onClick={() => setMenuOpen(false)}>About</Link>
              <Link href="/contact" className="text-apple-gray hover:text-apple-black transition-colors" onClick={() => setMenuOpen(false)}>Contact</Link>
              {session ? (
                <Link href="/dashboard" className="text-apple-gray hover:text-apple-black transition-colors" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              ) : (
                <Link href="/login" className="text-apple-blue hover:text-apple-blueHover transition-colors" onClick={() => setMenuOpen(false)}>Sign In</Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}