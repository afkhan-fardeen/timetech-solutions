'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAdminSession } from '../../../lib/AdminContext';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const { adminSession } = useAdminSession();

  useEffect(() => {
    if (!adminSession) return;
    fetchCustomers();
  }, [adminSession]);

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*, orders(*), addresses(*)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load customers');
      return;
    }
    setCustomers(data || []);
  };

  if (!adminSession) return null;

  return (
    <div className="min-h-screen bg-apple-light flex">
      <aside className="w-64 bg-white apple-shadow fixed h-full">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-apple-black mb-8 tracking-tight">Admin Panel</h2>
          <nav className="space-y-4">
            <Link href="/admin/dashboard" className="block text-apple-gray hover:text-apple-black transition-colors">Dashboard</Link>
            <Link href="/admin/products" className="block text-apple-gray hover:text-apple-black transition-colors">Products</Link>
            <Link href="/admin/categories" className="block text-apple-gray hover:text-apple-black transition-colors">Categories</Link>
            <Link href="/admin/orders" className="block text-apple-gray hover:text-apple-black transition-colors">Orders</Link>
            <Link href="/admin/customers" className="block text-apple-black font-medium">Customers</Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-semibold text-apple-black mb-8 tracking-tight">Customer Management</h1>
        <div className="bg-white rounded-xl apple-shadow p-6">
          <h2 className="text-xl font-semibold text-apple-black mb-4">Customers</h2>
          {customers.length === 0 ? (
            <p className="text-apple-gray">No customers found.</p>
          ) : (
            <div className="space-y-4">
              {customers.map((customer) => (
                <div key={customer.id} className="border-b border-gray-200 py-4">
                  <p className="text-apple-black font-medium">{customer.name}</p>
                  <p className="text-apple-gray text-sm">Email: {customer.email}</p>
                  <p className="text-apple-gray text-sm">Orders: {customer.orders.length}</p>
                  <p className="text-apple-gray text-sm">Addresses: {customer.addresses.length}</p>
                  <details className="mt-2">
                    <summary className="text-apple-blue cursor-pointer hover:text-apple-blueHover">View Details</summary>
                    <div className="mt-2 pl-4">
                      <p className="text-apple-gray font-medium">Addresses:</p>
                      {customer.addresses.length === 0 ? (
                        <p className="text-apple-gray text-sm">No addresses</p>
                      ) : (
                        <ul className="text-apple-gray text-sm">
                          {customer.addresses.map((addr) => (
                            <li key={addr.id}>
                              {addr.address_line1}, {addr.city}, {addr.state} {addr.postal_code}, {addr.country}
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="text-apple-gray font-medium mt-2">Orders:</p>
                      {customer.orders.length === 0 ? (
                        <p className="text-apple-gray text-sm">No orders</p>
                      ) : (
                        <ul className="text-apple-gray text-sm">
                          {customer.orders.map((order) => (
                            <li key={order.id}>Order #{order.id} - BD {order.total.toFixed(2)} - {order.status}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}