// app/checkout/page.js
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSession } from '../../lib/SessionContext';
import Header from '../../components/Header';

export default function Checkout() {
  const { session } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [billingInfos, setBillingInfos] = useState([]);
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [useSavedBilling, setUseSavedBilling] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedBilling, setSelectedBilling] = useState('');
  const [newAddress, setNewAddress] = useState({
    address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: ''
  });
  const [newBilling, setNewBilling] = useState({ card_number: '', expiry_date: '', cardholder_name: '' });

  useEffect(() => {
    if (!session) router.push('/login');
    fetchCart();
    fetchAddresses();
    fetchBillingInfos();
  }, [session, router]);

  const fetchCart = async () => {
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('customer_id', session.id)
      .single();
    if (!cart) return;

    const { data } = await supabase
      .from('cart_items')
      .select('*, products(name, price)')
      .eq('cart_id', cart.id);
    setCartItems(data || []);
  };

  const fetchAddresses = async () => {
    const { data } = await supabase.from('addresses').select('*').eq('customer_id', session.id);
    setAddresses(data || []);
    if (data?.length) setSelectedAddress(data[0].id);
  };

  const fetchBillingInfos = async () => {
    const { data } = await supabase.from('billing_info').select('*').eq('customer_id', session.id);
    setBillingInfos(data || []);
    if (data?.length) setSelectedBilling(data[0].id);
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!cartItems.length) {
      toast.error('Your cart is empty.');
      return;
    }

    let addressId = selectedAddress;
    let shippingAddress;

    if (useSavedAddress) {
      const { data } = await supabase.from('addresses').select('*').eq('id', addressId).single();
      shippingAddress = `${data.address_line1}, ${data.address_line2 || ''}, ${data.city}, ${data.state}, ${data.postal_code}, ${data.country}`;
    } else {
      const { data, error } = await supabase
        .from('addresses')
        .insert([{ ...newAddress, customer_id: session.id }])
        .select()
        .single();
      if (error) {
        toast.error('Failed to save address: ' + error.message);
        return;
      }
      addressId = data.id;
      shippingAddress = `${newAddress.address_line1}, ${newAddress.address_line2 || ''}, ${newAddress.city}, ${newAddress.state}, ${newAddress.postal_code}, ${newAddress.country}`;
      toast.success('New address saved!');
    }

    if (!useSavedBilling) {
      const { error } = await supabase
        .from('billing_info')
        .insert([{ ...newBilling, customer_id: session.id, is_default: billingInfos.length === 0 }]);
      if (error) {
        toast.error('Failed to save billing info: ' + error.message);
        return;
      }
      toast.success('New billing info saved!');
    }

    const total = cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0);
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ customer_id: session.id, total, shipping_address: shippingAddress, address_id: addressId }])
      .select()
      .single();

    if (orderError) {
      toast.error('Failed to place order: ' + orderError.message);
      return;
    }

    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_time: item.products.price,
    }));
    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      toast.error('Failed to save order items: ' + itemsError.message);
      return;
    }

    await supabase.from('cart_items').delete().eq('cart_id', cartItems[0].cart_id);
    toast.success(`Order #${order.id} placed! Total: ${total.toFixed(2)} BHD`);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 pt-20 px-4 sm:px-6 pb-12 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-apple-black mb-12 text-center tracking-tight">
          Checkout
        </h1>
        <form onSubmit={handleOrder} className="space-y-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-apple-black mb-6 tracking-tight">
              Shipping Address
            </h2>
            <div className="flex items-center space-x-3 mb-6">
              <input
                type="checkbox"
                checked={useSavedAddress}
                onChange={() => setUseSavedAddress(!useSavedAddress)}
                className="form-checkbox h-5 w-5 text-apple-blue rounded"
              />
              <span className="text-apple-gray text-sm font-medium">Use saved address</span>
            </div>
            {useSavedAddress ? (
              <select
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-apple-black text-sm sm:text-base"
              >
                <option value="">Select an address</option>
                {addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.address_line1}, {a.city}, {a.state}, {a.postal_code}, {a.country}
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-4">
                <input
                  placeholder="Address Line 1"
                  value={newAddress.address_line1}
                  onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm sm:text-base"
                  required
                />
                <input
                  placeholder="Address Line 2 (optional)"
                  value={newAddress.address_line2}
                  onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm sm:text-base"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm sm:text-base"
                    required
                  />
                  <input
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    placeholder="Postal Code"
                    value={newAddress.postal_code}
                    onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm sm:text-base"
                    required
                  />
                  <input
                    placeholder="Country"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Billing Information */}
          <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-apple-black mb-6 tracking-tight">
              Billing Information
            </h2>
            <div className="flex items-center space-x-3 mb-6">
              <input
                type="checkbox"
                checked={useSavedBilling}
                onChange={() => setUseSavedBilling(!useSavedBilling)}
                className="form-checkbox h-5 w-5 text-apple-blue rounded"
              />
              <span className="text-apple-gray text-sm font-medium">Use saved billing info</span>
            </div>
            {useSavedBilling ? (
              <select
                value={selectedBilling}
                onChange={(e) => setSelectedBilling(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-apple-black text-sm sm:text-base"
              >
                <option value="">Select billing info</option>
                {billingInfos.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.cardholder_name} - **** **** **** {b.card_number.slice(-4)}
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-4">
                <input
                  placeholder="Card Number"
                  value={newBilling.card_number}
                  onChange={(e) => setNewBilling({ ...newBilling, card_number: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm sm:text-base"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    placeholder="Expiry Date (MM/YY)"
                    value={newBilling.expiry_date}
                    onChange={(e) => setNewBilling({ ...newBilling, expiry_date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm sm:text-base"
                    required
                  />
                  <input
                    placeholder="Cardholder Name"
                    value={newBilling.cardholder_name}
                    onChange={(e) => setNewBilling({ ...newBilling, cardholder_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-apple-black mb-6 tracking-tight">
              Order Summary
            </h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-apple-gray text-sm">
                  <span>{item.products.name} x {item.quantity}</span>
                  <span>{(item.products.price * item.quantity).toFixed(2)} BHD</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg sm:text-xl font-semibold text-apple-black tracking-tight">
                  <span>Total</span>
                  <span>{cartItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0).toFixed(2)} BHD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            className="w-full bg-apple-black text-white px-6 py-3 sm:py-4 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md text-base sm:text-lg"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}