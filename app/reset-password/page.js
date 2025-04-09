// app/reset-password/page.js
'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  const handleReset = async (e) => {
    e.preventDefault();
    const { data: customer, error } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email)
      .single();

    if (error || !customer) {
      toast.error('No account found with that email.');
      return;
    }

    const { error: updateError } = await supabase
      .from('customers')
      .update({ password: newPassword })
      .eq('id', customer.id);

    if (updateError) {
      toast.error('Failed to reset password: ' + updateError.message);
      return;
    }

    toast.success('Password reset successfully! Please sign in.');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-semibold text-apple-black mb-8 text-center tracking-tight">
            Reset Password
          </h1>
          <form onSubmit={handleReset} className="space-y-6">
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
              <label className="block text-apple-gray text-sm mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-apple-black text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md"
            >
              Reset Password
            </button>
          </form>
          <p className="text-apple-gray text-center mt-6 text-sm">
            Back to{' '}
            <Link href="/login" className="text-apple-blue hover:text-apple-blueHover">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}