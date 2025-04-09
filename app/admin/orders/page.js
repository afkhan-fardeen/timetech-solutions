'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAdminSession } from '../../../lib/AdminContext';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const { adminSession } = useAdminSession();

  useEffect(() => {
    if (!adminSession) return;
    fetchOrders();
  }, [adminSession]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*, customers(name, email), order_items(*, products(name, price))')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load orders');
      return;
    }
    setOrders(data || []);
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('orders')
      .update({ status: editingOrder.status })
      .eq('id', editingOrder.id);

    if (error) {
      toast.error('Failed to update order');
      return;
    }
    setEditingOrder(null);
    fetchOrders();
    toast.success('Order updated successfully');
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
            <Link href="/admin/orders" className="block text-apple-black font-medium">Orders</Link>
            <Link href="/admin/customers" className="block text-apple-gray hover:text-apple-black transition-colors">Customers</Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-semibold text-apple-black mb-8 tracking-tight">Order Management</h1>
        <div className="bg-white rounded-xl apple-shadow p-6">
          <h2 className="text-xl font-semibold text-apple-black mb-4">Orders</h2>
          {orders.length === 0 ? (
            <p className="text-apple-gray">No orders found.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border-b border-gray-200 py-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-apple-black font-medium">Order #{order.id}</p>
                      <p className="text-apple-gray text-sm">Customer: {order.customers.name} ({order.customers.email})</p>
                      <p className="text-apple-gray text-sm">Placed: {new Date(order.created_at).toLocaleString()}</p>
                      <p className="text-apple-gray text-sm">Status: {order.status}</p>
                    </div>
                    <button
                      onClick={() => setEditingOrder(order)}
                      className="text-apple-blue hover:text-apple-blueHover"
                    >
                      Edit Status
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-apple-black font-semibold">BD {order.total.toFixed(2)}</p>
                    <ul className="text-apple-gray text-sm mt-1">
                      {order.order_items.map((item) => (
                        <li key={item.id}>{item.products.name} - Qty: {item.quantity} - BD {item.price_at_time.toFixed(2)}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {editingOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl apple-shadow p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-apple-black mb-4">Edit Order #{editingOrder.id}</h2>
              <form onSubmit={handleUpdateOrder} className="space-y-4">
                <select
                  value={editingOrder.status}
                  onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-apple-blue text-apple-black"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-apple-black text-white px-6 py-2 rounded-apple font-medium hover:bg-apple-blue transition-colors apple-shadow"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingOrder(null)}
                    className="bg-gray-200 text-apple-black px-6 py-2 rounded-apple font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}