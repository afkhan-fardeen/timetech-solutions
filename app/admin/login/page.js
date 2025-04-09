// app/admin/login/page.js
'use client';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useAdminSession } from '../../../lib/AdminContext';

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { updateAdminSession } = useAdminSession();

  const handleLogin = async (e) => {
    e.preventDefault();

    const trimmedIdentifier = identifier.trim();
    const trimmedPassword = password.trim();

    if (!trimmedIdentifier || !trimmedPassword) {
      toast.error('Please enter both identifier and password');
      console.log('Validation failed:', { identifier, password });
      return;
    }

    console.log('Admin login attempt:', { identifier: trimmedIdentifier });

    const isEmail = trimmedIdentifier.includes('@');
    const column = isEmail ? 'email' : 'name';

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq(column, trimmedIdentifier)
      .single();

    if (error || !admin) {
      console.log('Admin lookup failed:', error?.message || 'No admin found');
      toast.error('Invalid email/name or password');
      return;
    }

    if (admin.password !== trimmedPassword) {
      console.log('Password mismatch:', { stored: admin.password, provided: trimmedPassword });
      toast.error('Invalid email/name or password');
      return;
    }

    console.log('Admin login successful:', admin);
    updateAdminSession(admin); // Sync session with context
    toast.success('Admin logged in successfully!');
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 w-full max-w-md mx-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-apple-black mb-6 text-center tracking-tight">
          Admin Sign In
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-apple-gray text-sm sm:text-base mb-2">Email or Name</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-apple-blue text-apple-black text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-apple-gray text-sm sm:text-base mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-apple-blue text-apple-black text-sm sm:text-base"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-apple-black text-white px-6 py-2 sm:py-3 rounded-full font-medium hover:bg-apple-blue transition-colors shadow-md text-sm sm:text-base"
          >
            Sign In
          </button>
        </form>
        <p className="text-apple-gray text-center mt-6 text-sm">
  <Link href="/admin/reset-password" className="text-apple-blue hover:text-apple-blueHover">
    Forgot Password?
  </Link>
  <br />
  Don’t have an account?{' '}
  <Link href="/signup" className="text-apple-blue hover:text-apple-blueHover">
    Sign up
  </Link>
</p>
      </div>
    </div>
  );
}