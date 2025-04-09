// app/customer/dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSession } from '../../lib/SessionContext';
import Footer from '../../components/Footer';

export default function CustomerDashboard() {
  const { session, logout, updateSession } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', password: '' });
  const [billingInfo, setBillingInfo] = useState({ cardNumber: '', expiry: '', cvv: '' });
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: '',
  });
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showOrdersDropdown, setShowOrdersDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!session?.id) {
      router.push('/login');
      return;
    }

    const fetchInitialData = async () => {
      await Promise.all([fetchData(), fetchCustomerInfo(), fetchAddresses()]);
    };
    fetchInitialData();

    const subscription = supabase
      .channel('customer-orders-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders', filter: `customer_id=eq.${session.id}` },
        (payload) => {
          toast.success(`New order #${payload.new.id} placed! Total: ${payload.new.total} BHD`);
          setOrders((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [session, router]);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', session.id)
      .order('created_at', { ascending: false });
    if (error) toast.error('Failed to fetch orders: ' + error.message);
    else setOrders(data || []);
  };

  const fetchCustomerInfo = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('name, email')
      .eq('id', session.id)
      .single();
    if (error) toast.error('Failed to fetch info: ' + error.message);
    else setCustomerInfo({ name: data?.name || '', email: data?.email || '', password: '' });
  };

  const fetchAddresses = async () => {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('customer_id', session.id)
      .order('created_at', { ascending: false });
    if (error) toast.error('Failed to fetch addresses: ' + error.message);
    else setAddresses(data || []);
  };

  const updateCustomerInfo = async (e) => {
    e.preventDefault();
    const updates = { name: customerInfo.name || null, email: customerInfo.email };
    if (customerInfo.password) updates.password = customerInfo.password;
    const { error } = await supabase.from('customers').update(updates).eq('id', session.id);
    if (error) toast.error('Failed to update info: ' + error.message);
    else {
      toast.success('Info updated!');
      updateSession({ ...session, name: customerInfo.name, email: customerInfo.email });
      setCustomerInfo({ ...customerInfo, password: '' });
    }
  };

  const resetPassword = async () => {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
      const { error } = await supabase
        .from('customers')
        .update({ password: newPassword })
        .eq('id', session.id);
      if (error) toast.error('Failed to reset password: ' + error.message);
      else toast.success('Password reset successfully!');
    }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('addresses').insert([{
      customer_id: session.id,
      ...newAddress,
    }]);
    if (error) toast.error('Failed to add address: ' + error.message);
    else {
      toast.success('Address added!');
      setNewAddress({ address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: '' });
      fetchAddresses();
    }
  };

  const setDefaultAddress = async (addressId) => {
    const { error } = await supabase
      .from('customers')
      .update({ default_address_id: addressId })
      .eq('id', session.id);
    if (error) toast.error('Failed to set default address: ' + error.message);
    else toast.success('Default address set!');
  };

  const saveBillingInfo = async (e) => {
    e.preventDefault();
    toast.success('Billing info saved (simulated)!'); // Add real payment integration later
  };

  const cancelOrder = async (orderId) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId)
      .eq('customer_id', session.id);
    if (error) toast.error('Failed to cancel order: ' + error.message);
    else {
      toast.success('Order cancelled!');
      fetchData();
    }
  };

  const addOrderNote = async (orderId, note) => {
    const { error } = await supabase
      .from('orders')
      .update({ notes: note })
      .eq('id', orderId)
      .eq('customer_id', session.id);
    if (error) toast.error('Failed to add note: ' + error.message);
    else toast.success('Note added!');
  };

  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    deliveredOrders: orders.filter((o) => o.status === 'delivered').length,
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex">
        <div
          className={`fixed inset-y-0 left-0 w-72 bg-white shadow-lg transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 z-20`}
        >
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-apple-black tracking-tight">Customer Dashboard</h1>
            <button
              className="md:hidden mt-4 text-apple-gray text-sm"
              onClick={() => setSidebarOpen(false)}
            >
              Close
            </button>
          </div>
          <nav className="p-6 space-y-4">
            <button
              className="w-full text-left text-apple-blue hover:text-apple-blueHover font-medium text-sm"
              onClick={() => router.push('/')}
            >
              Home
            </button>
            <button
              className="w-full text-left text-apple-blue hover:text-apple-blueHover font-medium text-sm"
              onClick={() => scrollToSection('overview')}
            >
              Overview
            </button>
            <div>
              <button
                className="w-full text-left text-apple-blue hover:text-apple-blueHover font-medium text-sm"
                onClick={() => setShowOrdersDropdown(!showOrdersDropdown)}
              >
                Orders ▼
              </button>
              {showOrdersDropdown && (
                <div className="pl-4 space-y-2 mt-2">
                  <button
                    className="w-full text-left text-apple-gray hover:text-apple-black text-sm"
                    onClick={() => scrollToSection('my-orders')}
                  >
                    View Orders
                  </button>
                  <button
                    className="w-full text-left text-apple-gray hover:text-apple-black text-sm"
                    onClick={() => scrollToSection('address-management')}
                  >
                    Address Management
                  </button>
                  <button
                    className="w-full text-left text-apple-gray hover:text-apple-black text-sm"
                    onClick={() => scrollToSection('billing-info')}
                  >
                    Billing Info
                  </button>
                </div>
              )}
            </div>
            <div>
              <button
                className="w-full text-left text-apple-blue hover:text-apple-blueHover font-medium text-sm"
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              >
                Account ▼
              </button>
              {showAccountDropdown && (
                <div className="pl-4 space-y-2 mt-2">
                  <button
                    className="w-full text-left text-apple-gray hover:text-apple-black text-sm"
                    onClick={() => scrollToSection('my-info')}
                  >
                    Edit Personal Info
                  </button>
                  <button
                    className="w-full text-left text-apple-gray hover:text-apple-black text-sm"
                    onClick={resetPassword}
                  >
                    Reset Password
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={logout}
              className="w-full text-left text-apple-gray hover:text-apple-black font-medium text-sm"
            >
              Logout
            </button>
          </nav>
        </div>

        <div className="flex-1 md:ml-72 p-6">
          <button
            className="md:hidden mb-6 text-apple-black font-medium text-sm"
            onClick={() => setSidebarOpen(true)}
          >
            ☰ Menu
          </button>

          <div id="overview" className="bg-white rounded-3xl shadow-md p-6 mb-8">
            <h1 className="text-4xl font-bold text-apple-black tracking-tight mb-6">Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl shadow-sm">
                <p className="text-sm text-apple-gray">Total Orders</p>
                <p className="text-2xl font-semibold text-apple-black tracking-tight">{stats.totalOrders}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl shadow-sm">
                <p className="text-sm text-apple-gray">Pending Orders</p>
                <p className="text-2xl font-semibold text-apple-black tracking-tight">{stats.pendingOrders}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl shadow-sm">
                <p className="text-sm text-apple-gray">Delivered Orders</p>
                <p className="text-2xl font-semibold text-apple-black tracking-tight">{stats.deliveredOrders}</p>
              </div>
            </div>
          </div>

          <div id="my-orders" className="bg-white rounded-3xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-apple-black tracking-tight mb-4">My Orders</h2>
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-apple-black tracking-tight">Order #{o.id} - {o.total?.toFixed(2) || '0.00'} BHD</p>
                    <p className="text-xs text-apple-gray">Status: {o.status || 'pending'}</p>
                    <button
                      className="text-apple-blue hover:text-apple-blueHover text-xs"
                      onClick={() => alert('Tracking link: Coming soon!')}
                    >
                      Track Order
                    </button>
                    <br />
                    <input
                      type="text"
                      placeholder="Add a note (e.g., urgent)"
                      onBlur={(e) => addOrderNote(o.id, e.target.value)}
                      className="text-xs mt-1 px-2 py-1 border border-gray-200 rounded"
                    />
                  </div>
                  {o.status === 'pending' && (
                    <button
                      onClick={() => cancelOrder(o.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
              {orders.length === 0 && <p className="text-apple-gray text-sm">No orders yet.</p>}
            </div>
          </div>

          <div id="address-management" className="bg-white rounded-3xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-apple-black tracking-tight mb-4">Address Management</h2>
            <form onSubmit={addAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <input
                placeholder="Address Line 1"
                value={newAddress.address_line1}
                onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
                required
              />
              <input
                placeholder="Address Line 2 (optional)"
                value={newAddress.address_line2}
                onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
              />
              <input
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
                required
              />
              <input
                placeholder="State"
                value={newAddress.state}
                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
                required
              />
              <input
                placeholder="Postal Code"
                value={newAddress.postal_code}
                onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
                required
              />
              <input
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
                required
              />
              <button
                type="submit"
                className="w-full sm:col-span-2 bg-apple-black text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md text-sm"
              >
                Add Address
              </button>
            </form>
            <div className="space-y-4">
              {addresses.map((a) => (
                <div key={a.id} className="border-b border-gray-100 pb-4">
                  <p className="text-sm text-apple-black">
                    {a.address_line1}, {a.address_line2 ? `${a.address_line2}, ` : ''}{a.city}, {a.state}, {a.postal_code}, {a.country}
                  </p>
                  <button
                    onClick={() => setDefaultAddress(a.id)}
                    className="text-apple-blue hover:text-apple-blueHover text-xs mt-1"
                  >
                    Set as Default
                  </button>
                </div>
              ))}
              {addresses.length === 0 && <p className="text-apple-gray text-sm">No addresses yet.</p>}
            </div>
          </div>

          <div id="billing-info" className="bg-white rounded-3xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-apple-black tracking-tight mb-4">Billing Info</h2>
            <form onSubmit={saveBillingInfo} className="grid grid-cols-1 gap-4 max-w-md">
              <input
                placeholder="Card Number"
                value={billingInfo.cardNumber}
                onChange={(e) => setBillingInfo({ ...billingInfo, cardNumber: e.target.value })}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
                required
              />
              <input
                placeholder="Expiry (MM/YY)"
                value={billingInfo.expiry}
                onChange={(e) => setBillingInfo({ ...billingInfo, expiry: e.target.value })}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
                required
              />
              <input
                placeholder="CVV"
                value={billingInfo.cvv}
                onChange={(e) => setBillingInfo({ ...billingInfo, cvv: e.target.value })}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
                required
              />
              <button
                type="submit"
                className="w-full bg-apple-black text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md text-sm"
              >
                Save Billing Info
              </button>
            </form>
          </div>

          <div id="my-info" className="bg-white rounded-3xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-apple-black tracking-tight mb-4">My Info</h2>
            <form onSubmit={updateCustomerInfo} className="grid grid-cols-1 gap-4 max-w-md">
              <input
                placeholder="Name (optional)"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
              />
              <input
                placeholder="Email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
                required
              />
              <input
                placeholder="New Password (optional)"
                type="password"
                value={customerInfo.password}
                onChange={(e) => setCustomerInfo({ ...customerInfo, password: e.target.value })}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
              />
              <button
                type="submit"
                className="w-full bg-apple-black text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md text-sm"
              >
                Update Info
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}