'use client';
import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail || !trimmedPassword || !trimmedName) {
      toast.error('Please fill in all fields');
      console.log('Validation failed:', { email, password, name });
      return;
    }

    console.log('Admin signup attempt:', { email: trimmedEmail, name: trimmedName });

    // Check for existing email or name
    const { data: existing, error: checkError } = await supabase
      .from('admins')
      .select('email, name')
      .or(`email.eq.${trimmedEmail},name.eq.${trimmedName}`);

    if (checkError) {
      console.log('Check error:', checkError.message);
      toast.error('Error checking existing admin');
      return;
    }

    if (existing && existing.length > 0) {
      console.log('Duplicate found:', existing);
      toast.error('Email or name already taken');
      return;
    }

    // Insert new admin
    const { data, error } = await supabase
      .from('admins')
      .insert([{ email: trimmedEmail, name: trimmedName, password: trimmedPassword }])
      .select()
      .single();

    if (error) {
      console.log('Signup error:', error.message);
      toast.error('Failed to sign up');
      return;
    }

    console.log('Admin signup successful:', data);
    toast.success('Signup successful!');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 w-full max-w-md mx-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-apple-black mb-6 text-center tracking-tight">
          Admin Sign Up
        </h1>
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-apple-gray text-sm sm:text-base mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-apple-blue text-apple-black text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-apple-gray text-sm sm:text-base mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Sign Up
          </button>
        </form>
        <p className="text-apple-gray text-center mt-4 text-sm sm:text-base">
          Already have an account?{' '}
          <Link href="/admin/login" className="text-apple-blue hover:text-apple-blueHover">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}