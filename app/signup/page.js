// app/signup/page.js
'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useSession } from '../../lib/SessionContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();
  const { updateSession } = useSession();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { data: customer, error } = await supabase
      .from('customers')
      .insert([{ email, password, name }])
      .select()
      .single();

    if (error) {
      toast.error('Signup failed: ' + error.message);
      return;
    }

    updateSession(customer);
    await supabase.from('carts').insert([{ customer_id: customer.id }]);
    toast.success('Account created! Welcome to TimeTech.');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-semibold text-apple-black mb-8 text-center tracking-tight">
            Sign Up
          </h1>
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-apple-gray text-sm mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-apple-gray text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-apple-gray text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-apple-black text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md"
            >
              Sign Up
            </button>
          </form>
          <p className="text-apple-gray text-center mt-6 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-apple-blue hover:text-apple-blueHover">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}