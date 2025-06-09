'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-apple-light/90 backdrop-blur-md shadow-apple z-10">
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold text-apple-black tracking-tight">
          TimeTech
        </Link>

        <div className="hidden md:flex space-x-10 items-center">
          <Link href="/products" className="text-apple-gray hover:text-apple-black transition-colors">Products</Link>
          <Link href="/about" className="text-apple-gray hover:text-apple-black transition-colors">About</Link>
          <Link href="/contact" className="text-apple-gray hover:text-apple-black transition-colors">Contact</Link>
        </div>

        <div className="flex items-center md:hidden">
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
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}