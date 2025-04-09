// app/page.js
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, description, image_url')
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) console.error('Error fetching products:', error.message);
      else setProducts(data || []);
    };
    fetchProducts();

    const handleSmoothScroll = (e) => {
      if (e.target.tagName === 'A' && e.target.hash) {
        e.preventDefault();
        const targetId = e.target.hash.slice(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    };
    document.addEventListener('click', handleSmoothScroll);
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, []);

  return (
    <>
      <Head>
        <title>TimeTech Solutions | Queuing Systems, RFID, Digital Signage</title>
        <meta
          name="description"
          content="Optimize your business with TimeTech's advanced queuing systems, RFID technology, and digital signage solutions. Discover efficiency and innovation."
        />
        <meta
          name="keywords"
          content="queuing systems, RFID technology, digital signage, TimeTech, business solutions, queue management, asset tracking"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="TimeTech Solutions" />
        <meta
          property="og:description"
          content="Streamline operations with TimeTech's queuing, RFID, and signage solutions."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://your-timetech-domain.vercel.app/" />
        <meta property="og:image" content="/og-image.jpg" />
        <link rel="canonical" href="https://your-timetech-domain.vercel.app/" />
      </Head>
      <div className="bg-gray-50">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <section id="hero" className="pt-24 px-4 sm:px-6 flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-7xl font-bold text-apple-black tracking-tight mb-6">
              TimeTech Solutions
            </h1>
            <p className="text-lg sm:text-xl text-apple-gray max-w-2xl mx-auto leading-relaxed">
              Streamline your operations with advanced queuing systems, RFID technology, and digital signage.
            </p>
            <div className="mt-8 space-x-4">
              <Link href="/products" className="inline-block bg-apple-black text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md">
                Explore Products
              </Link>
              <Link href="#features" className="inline-block text-apple-blue hover:text-apple-blueHover font-medium">
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-apple-black tracking-tight mb-12">
              Built for Efficiency
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-apple-black">📋</span>
                </div>
                <h3 className="text-xl font-semibold text-apple-black mb-2">Queue Management</h3>
                <p className="text-apple-gray text-sm leading-relaxed">
                  Reduce wait times and improve customer flow with smart queuing solutions.
                </p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-apple-black">🏷️</span>
                </div>
                <h3 className="text-xl font-semibold text-apple-black mb-2">RFID Tracking</h3>
                <p className="text-apple-gray text-sm leading-relaxed">
                  Real-time asset management with precision RFID technology.
                </p>
              </div>
              <div className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-apple-black">🖥️</span>
                </div>
                <h3 className="text-xl font-semibold text-apple-black mb-2">Digital Signage</h3>
                <p className="text-apple-gray text-sm leading-relaxed">
                  Engage audiences with dynamic, high-impact displays.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Showcase Section */}
        <section id="products" className="py-20 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-apple-black tracking-tight mb-12">
              Our Core Solutions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-3xl shadow-lg overflow-hidden">
                  <img
                    src={product.image_url || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-apple-black tracking-tight">{product.name}</h3>
                    <p className="text-apple-gray text-sm mt-2">Starting at {product.price.toFixed(2)} BHD</p>
                    <Link href={`/products/${product.id}`} className="inline-block mt-4 text-apple-blue hover:text-apple-blueHover font-medium">
                      Explore
                    </Link>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-apple-gray text-sm col-span-full">Loading products...</p>
              )}
            </div>
            <Link href="/products" className="inline-block mt-12 bg-apple-black text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md">
              View All Solutions
            </Link>
          </div>
        </section>

        {/* Why Us Section */}
        <section id="why-us" className="py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-4xl sm:text-5xl font-bold text-apple-black tracking-tight mb-6">
                Why TimeTech?
              </h2>
              <p className="text-lg text-apple-gray max-w-lg mx-auto lg:mx-0 leading-relaxed">
                We deliver robust, reliable technology to optimize your business—designed for scale, built for impact.
              </p>
              <Link href="#cta" className="inline-block mt-6 text-apple-blue hover:text-apple-blueHover font-medium">
                Get Started
              </Link>
            </div>
            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <img src="/why-us.jpg" alt="Why TimeTech Solutions" className="w-full h-96 object-cover rounded-3xl shadow-lg" />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-apple-black tracking-tight mb-12">
              Trusted by Businesses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <p className="text-apple-gray text-sm italic leading-relaxed">
                  "TimeTech’s queuing system cut our wait times in half—game-changer."
                </p>
                <p className="mt-4 text-apple-black font-medium">— Ali H., Retail Manager</p>
              </div>
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <p className="text-apple-gray text-sm italic leading-relaxed">
                  "RFID tracking streamlined our inventory like never before."
                </p>
                <p className="mt-4 text-apple-black font-medium">— Fatima S., Logistics Lead</p>
              </div>
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <p className="text-apple-gray text-sm italic leading-relaxed">
                  "Digital signage that grabs attention—our customers love it."
                </p>
                <p className="mt-4 text-apple-black font-medium">— Omar K., Marketing Director</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section id="cta" className="py-20 px-4 sm:px-6 bg-gradient-to-b from-gray-100 to-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-apple-black tracking-tight mb-6">
              Transform Your Operations
            </h2>
            <p className="text-lg text-apple-gray max-w-xl mx-auto leading-relaxed">
              Sign up to access cutting-edge solutions tailored for your business.
            </p>
            <div className="mt-8 space-x-4">
              <Link href="/signup" className="inline-block bg-apple-black text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md">
                Get Started
              </Link>
              <Link href="/login" className="inline-block text-apple-blue hover:text-apple-blueHover font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}