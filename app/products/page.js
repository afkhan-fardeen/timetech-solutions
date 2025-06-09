'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { products, categories } from '../../lib/products';

export default function Products() {
  const [filter, setFilter] = useState({ category: '', minPrice: '', maxPrice: '' });

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (filter.category) {
      filtered = filtered.filter((p) => p.category_id === parseInt(filter.category));
    }
    const minPrice = filter.minPrice !== '' ? parseFloat(filter.minPrice) : -Infinity;
    const maxPrice = filter.maxPrice !== '' ? parseFloat(filter.maxPrice) : Infinity;
    filtered = filtered.filter((p) => p.price >= minPrice && p.price <= maxPrice);
    return filtered;
  }, [filter.category, filter.minPrice, filter.maxPrice]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-apple-black tracking-tight mb-3">
            TimeTech Collection
          </h1>
          <p className="text-lg text-apple-gray max-w-xl mx-auto">
            Crafted for the future. Explore our range.
          </p>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto mb-10 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
          <select
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            className="w-full sm:w-48 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-apple-black text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={filter.minPrice}
            onChange={(e) => setFilter({ ...filter, minPrice: e.target.value })}
            className="w-full sm:w-32 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-apple-black text-sm"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={filter.maxPrice}
            onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
            className="w-full sm:w-32 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-apple-black text-sm"
          />
        </div>

        {/* Product Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:scale-102 transition-transform duration-200"
            >
              <div className="relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-apple-black tracking-tight mb-1">{product.name}</h3>
                <p className="text-apple-gray text-xs line-clamp-2 mb-4">{product.description}</p>
                <div className="flex justify-start">
                  <span className="bg-apple-black text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-apple-blue transition-all shadow-apple">
                    View Details
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {filteredProducts.length === 0 && (
            <p className="text-center text-apple-gray col-span-full text-sm">
              No products match your filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}