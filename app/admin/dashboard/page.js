// app/admin/dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAdminSession } from '../../../lib/AdminContext';

export default function AdminDashboard() {
  const { adminSession, logout, updateAdminSession } = useAdminSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customersCount, setCustomersCount] = useState(0);
  const [newProduct, setNewProduct] = useState({
    name: '', description: '', price: '', stock: '', category_id: '', image_url: '',
  });
  const [editProduct, setEditProduct] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [editOrder, setEditOrder] = useState(null);
  const [adminInfo, setAdminInfo] = useState({ name: '', email: '', password: '' });
  const [bulkCSV, setBulkCSV] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!adminSession?.id) {
      router.push('/admin/login');
      return;
    }

    const fetchInitialData = async () => {
      await Promise.all([fetchData(), fetchAdminInfo()]);
    };
    fetchInitialData();

    const subscription = supabase
      .channel('orders-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        toast.success(`New order #${payload.new.id} placed! Total: ${payload.new.total} BHD`);
        setOrders((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [adminSession, router]);

  const fetchData = async () => {
    const [productsRes, categoriesRes, ordersRes, customersRes, addressesRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
      supabase.from('orders').select('*, addresses!address_id(*)').order('created_at', { ascending: false }),
      supabase.from('customers').select('id, name, email, default_address_id'),
      supabase.from('addresses').select('*'),
    ]);

    if (productsRes.error) toast.error('Failed to fetch products: ' + productsRes.error.message);
    if (categoriesRes.error) toast.error('Failed to fetch categories: ' + categoriesRes.error.message);
    if (ordersRes.error) toast.error('Failed to fetch orders: ' + ordersRes.error.message);
    if (customersRes.error) toast.error('Failed to fetch customers: ' + customersRes.error.message);
    if (addressesRes.error) toast.error('Failed to fetch addresses: ' + addressesRes.error.message);

    // Merge customer addresses manually
    const customersWithAddresses = (customersRes.data || []).map((customer) => ({
      ...customer,
      addresses: (addressesRes.data || []).filter((a) => a.customer_id === customer.id),
    }));

    setProducts(productsRes.data || []);
    setCategories(categoriesRes.data || []);
    setOrders(ordersRes.data || []);
    setCustomers(customersWithAddresses);
    setCustomersCount(customersRes.data?.length || 0);
  };

  const fetchAdminInfo = async () => {
    const { data, error } = await supabase
      .from('admins')
      .select('name, email')
      .eq('id', adminSession.id)
      .single();
    if (error) toast.error('Failed to fetch admin info: ' + error.message);
    else setAdminInfo({ name: data?.name || '', email: data?.email || '', password: '' });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('products').insert([{
      name: newProduct.name,
      description: newProduct.description || null,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      category_id: newProduct.category_id ? parseInt(newProduct.category_id) : null,
      image_url: newProduct.image_url || null,
    }]);
    if (error) toast.error('Failed to add product: ' + error.message);
    else {
      toast.success('Product added!');
      setNewProduct({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '' });
      fetchData();
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('products').update({
      name: editProduct.name,
      description: editProduct.description || null,
      price: parseFloat(editProduct.price),
      stock: parseInt(editProduct.stock),
      category_id: editProduct.category_id ? parseInt(editProduct.category_id) : null,
      image_url: editProduct.image_url || null,
    }).eq('id', editProduct.id);
    if (error) toast.error('Failed to update product: ' + error.message);
    else {
      toast.success('Product updated!');
      setEditProduct(null);
      fetchData();
    }
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error('Failed to delete product: ' + error.message);
    else {
      toast.success('Product deleted!');
      fetchData();
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('categories').insert([{ name: newCategory }]);
    if (error) toast.error('Failed to add category: ' + error.message);
    else {
      toast.success('Category added!');
      setNewCategory('');
      fetchData();
    }
  };

  const deleteCategory = async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) toast.error('Failed to delete category: ' + error.message);
    else {
      toast.success('Category deleted!');
      fetchData();
    }
  };

  const updateOrder = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('orders').update({
      status: editOrder.status,
      address_id: editOrder.address_id,
      notes: editOrder.notes,
    }).eq('id', editOrder.id);
    if (error) toast.error('Failed to update order: ' + error.message);
    else {
      toast.success('Order updated!');
      setEditOrder(null);
      fetchData();
    }
  };

  const updateAdminInfo = async (e) => {
    e.preventDefault();
    const updates = { name: adminInfo.name, email: adminInfo.email };
    if (adminInfo.password) updates.password = adminInfo.password;
    const { error } = await supabase.from('admins').update(updates).eq('id', adminSession.id);
    if (error) toast.error('Failed to update info: ' + error.message);
    else {
      toast.success('Info updated!');
      updateAdminSession({ ...adminSession, name: adminInfo.name, email: adminInfo.email });
      setAdminInfo({ ...adminInfo, password: '' });
    }
  };

  const resetAdminPassword = async () => {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
      const { error } = await supabase
        .from('admins')
        .update({ password: newPassword })
        .eq('id', adminSession.id);
      if (error) toast.error('Failed to reset password: ' + error.message);
      else toast.success('Password reset successfully!');
    }
  };

  const resetCustomerPassword = async (customerId) => {
    const newPassword = prompt(`Enter new password for customer ${customerId}:`);
    if (newPassword) {
      const { error } = await supabase
        .from('customers')
        .update({ password: newPassword })
        .eq('id', customerId);
      if (error) toast.error('Failed to reset customer password: ' + error.message);
      else toast.success(`Password reset for customer ${customerId}!`);
    }
  };

  const bulkUploadProducts = async (e) => {
    e.preventDefault();
    if (!bulkCSV) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const csv = event.target.result;
      const lines = csv.split('\n').slice(1);
      const productsToInsert = lines.map((line) => {
        const [name, description, price, stock, category_id, image_url] = line.split(',');
        return {
          name,
          description: description || null,
          price: parseFloat(price),
          stock: parseInt(stock),
          category_id: category_id ? parseInt(category_id) : null,
          image_url: image_url || null,
        };
      });
      const { error } = await supabase.from('products').insert(productsToInsert);
      if (error) toast.error('Bulk upload failed: ' + error.message);
      else {
        toast.success('Products uploaded successfully!');
        setBulkCSV(null);
        fetchData();
      }
    };
    reader.readAsText(bulkCSV);
  };

  const exportOrdersToCSV = () => {
    const csvContent = [
      'id,customer_id,total,status,address_line1,city,state,postal_code,country,notes',
      ...orders.map((o) => `${o.id},${o.customer_id},${o.total || 0},${o.status || 'pending'},${o.addresses?.address_line1 || ''},${o.addresses?.city || ''},${o.addresses?.state || ''},${o.addresses?.postal_code || ''},${o.addresses?.country || ''},${o.notes || ''}`)
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    deliveredOrders: orders.filter((o) => o.status === 'delivered').length,
    totalCustomers: customersCount,
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 z-20`}
      >
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-semibold text-apple-black tracking-tight">Admin Dashboard</h1>
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
            onClick={() => scrollToSection('overview')}
          >
            Overview
          </button>
          <div>
            <button
              className="w-full text-left text-apple-blue hover:text-apple-blueHover font-medium text-sm"
              onClick={() => setShowProductDropdown(!showProductDropdown)}
            >
              Product Management ▼
            </button>
            {showProductDropdown && (
              <div className="pl-4 space-y-2 mt-2">
                <button
                  className="w-full text-left text-apple-gray hover:text-apple-black text-sm"
                  onClick={() => scrollToSection('add-product')}
                >
                  Add Products
                </button>
                <button
                  className="w-full text-left text-apple-gray hover:text-apple-black text-sm"
                  onClick={() => scrollToSection('add-category')}
                >
                  Add Categories
                </button>
                <button
                  className="w-full text-left text-apple-gray hover:text-apple-black text-sm"
                  onClick={() => scrollToSection('products')}
                >
                  View Products
                </button>
                <button
                  className="w-full text-left text-apple-gray hover:text-apple-black text-sm"
                  onClick={() => scrollToSection('bulk-upload')}
                >
                  Bulk Upload
                </button>
              </div>
            )}
          </div>
          <div>
            <button
              className="w-full text-left text-apple-blue hover:text-apple-blueHover font-medium text-sm"
              onClick={() => setShowOrderDropdown(!showOrderDropdown)}
            >
              Order Management ▼
            </button>
            {showOrderDropdown && (
              <div className="pl-4 space-y-2 mt-2">
                <button
                  className="w-full text-left text-apple-gray hover:text-apple-black text-sm"
                  onClick={() => scrollToSection('orders')}
                >
                  View Orders
                </button>
                <button
                  className="w-full text-left text-apple-gray hover:text-apple-black text-sm"
                  onClick={() => scrollToSection('orders')}
                >
                  Update Status
                </button>
                <button
                  className="w-full text-left text-apple-gray hover:text-apple-black text-sm"
                  onClick={() => scrollToSection('orders')}
                >
                  Edit Delivery Address
                </button>
                <button
                  className="w-full text-left text-apple-gray hover:text-apple-black text-sm"
                  onClick={exportOrdersToCSV}
                >
                  Export to CSV
                </button>
              </div>
            )}
          </div>
          <div>
            <button
              className="w-full text-left text-apple-blue hover:text-apple-blueHover font-medium text-sm"
              onClick={() => setShowCustomerDropdown(!showCustomerDropdown)}
            >
              Customers ▼
            </button>
            {showCustomerDropdown && (
              <div className="pl-4 space-y-2 mt-2">
                <button
                  className="w-full text-left text-apple-gray hover:text-apple-black text-sm"
                  onClick={() => scrollToSection('customers')}
                >
                  View Customer Info
                </button>
                <button
                  className="w-full text-left text-apple-gray hover:text-apple-black text-sm"
                  onClick={() => scrollToSection('customers')}
                >
                  View Orders
                </button>
                <button
                  className="w-full text-left text-apple-gray hover:text-apple-black text-sm"
                  onClick={() => scrollToSection('customers')}
                >
                  Reset Customer Password
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
                  onClick={resetAdminPassword}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl shadow-sm">
              <p className="text-sm text-apple-gray">Total Products</p>
              <p className="text-2xl font-semibold text-apple-black tracking-tight">{stats.totalProducts}</p>
            </div>
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
            <div className="p-4 bg-gray-50 rounded-2xl shadow-sm">
              <p className="text-sm text-apple-gray">Total Customers</p>
              <p className="text-2xl font-semibold text-apple-black tracking-tight">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>

        <div id="add-product" className="bg-white rounded-3xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-apple-black tracking-tight mb-4">Add New Product</h2>
          <form onSubmit={addProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
              required
            />
            <input
              placeholder="Price"
              type="number"
              step="0.01"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
              required
            />
            <input
              placeholder="Stock"
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
              required
            />
            <select
              value={newProduct.category_id}
              onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
              className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
            >
              <option value="">No Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              placeholder="Image URL (optional)"
              value={newProduct.image_url}
              onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
              className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
            />
            <textarea
              placeholder="Description (optional)"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="w-full sm:col-span-2 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm resize-none h-24"
            />
            <button
              type="submit"
              className="w-full sm:col-span-2 bg-apple-black text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md text-sm"
            >
              Add Product
            </button>
          </form>
        </div>

        <div id="bulk-upload" className="bg-white rounded-3xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-apple-black tracking-tight mb-4">Bulk Product Upload (CSV)</h2>
          <form onSubmit={bulkUploadProducts} className="space-y-4">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setBulkCSV(e.target.files[0])}
              className="w-full px-4 py-2 rounded-full border border-gray-200 text-sm"
            />
            <p className="text-xs text-apple-gray">Format: name,description,price,stock,category_id,image_url</p>
            <button
              type="submit"
              className="w-full bg-apple-black text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md text-sm"
            >
              Upload CSV
            </button>
          </form>
        </div>

        {editProduct && (
          <div className="bg-white rounded-3xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-apple-black tracking-tight mb-4">Edit Product #{editProduct.id}</h2>
            <form onSubmit={updateProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                placeholder="Name"
                value={editProduct.name}
                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
                required
              />
              <input
                placeholder="Price"
                type="number"
                step="0.01"
                value={editProduct.price}
                onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
                required
              />
              <input
                placeholder="Stock"
                type="number"
                value={editProduct.stock}
                onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
                required
              />
              <select
                value={editProduct.category_id || ''}
                onChange={(e) => setEditProduct({ ...editProduct, category_id: e.target.value })}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
              >
                <option value="">No Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                placeholder="Image URL (optional)"
                value={editProduct.image_url || ''}
                onChange={(e) => setEditProduct({ ...editProduct, image_url: e.target.value })}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
              />
              <textarea
                placeholder="Description (optional)"
                value={editProduct.description || ''}
                onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                className="w-full sm:col-span-2 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm resize-none h-24"
              />
              <button
                type="submit"
                className="w-full bg-apple-black text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md text-sm"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditProduct(null)}
                className="w-full bg-gray-200 text-apple-black px-6 py-3 rounded-full font-medium hover:bg-gray-300 transition-all text-sm"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        <div id="products" className="bg-white rounded-3xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-apple-black tracking-tight mb-4">Products</h2>
          <div className="space-y-4">
            {products.map((p) => (
              <div key={p.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <img
                    src={p.image_url || '/placeholder.jpg'}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded-xl shadow-sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-apple-black tracking-tight">{p.name} - {p.price.toFixed(2)} BHD</p>
                    <p className="text-xs text-apple-gray">Stock: {p.stock} | Category: {categories.find((c) => c.id === p.category_id)?.name || 'None'}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditProduct({ ...p })}
                    className="text-apple-blue hover:text-apple-blueHover font-medium text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-red-500 hover:text-red-700 font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && <p className="text-apple-gray text-sm">No products yet.</p>}
          </div>
        </div>

        <div id="add-category" className="bg-white rounded-3xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-apple-black tracking-tight mb-4">Categories</h2>
          <form onSubmit={addCategory} className="flex gap-4 mb-6">
            <input
              placeholder="Category Name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
              required
            />
            <button
              type="submit"
              className="bg-apple-black text-white px-6 py-2 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md text-sm"
            >
              Add
            </button>
          </form>
          <div className="space-y-4">
            {categories.map((c) => (
              <div key={c.id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-b-0">
                <p className="text-sm text-apple-black tracking-tight">{c.name}</p>
                <button
                  onClick={() => deleteCategory(c.id)}
                  className="text-red-500 hover:text-red-700 font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
            {categories.length === 0 && <p className="text-apple-gray text-sm">No categories yet.</p>}
          </div>
        </div>

        <div id="orders" className="bg-white rounded-3xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-apple-black tracking-tight mb-4">Orders</h2>
          {editOrder && (
            <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
              <h3 className="text-sm font-medium text-apple-black tracking-tight mb-2">Edit Order #{editOrder.id}</h3>
              <form onSubmit={updateOrder} className="space-y-4">
                <select
                  value={editOrder.status || 'pending'}
                  onChange={(e) => setEditOrder({ ...editOrder, status: e.target.value })}
                  className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={editOrder.address_id || ''}
                  onChange={(e) => setEditOrder({ ...editOrder, address_id: e.target.value })}
                  className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
                >
                  <option value="">Select Address</option>
                  {customers.find((c) => c.id === editOrder.customer_id)?.addresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.address_line1}, {a.city}, {a.country}
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder="Order Notes"
                  value={editOrder.notes || ''}
                  onChange={(e) => setEditOrder({ ...editOrder, notes: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm resize-none h-24"
                />
                <button
                  type="submit"
                  className="w-full bg-apple-black text-white px-6 py-3 rounded-full font-medium hover:bg-apple-blue transition-all shadow-md text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditOrder(null)}
                  className="w-full bg-gray-200 text-apple-black px-6 py-3 rounded-full font-medium hover:bg-gray-300 transition-all text-sm"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-apple-black tracking-tight">Order #{o.id} - {o.total?.toFixed(2) || '0.00'} BHD</p>
                  <p className="text-xs text-apple-gray">
                    Status: {o.status || 'pending'} | Customer ID: {o.customer_id || 'N/A'} | 
                    Address: {o.addresses ? `${o.addresses.address_line1}, ${o.addresses.city}` : 'No address'}
                  </p>
                  {o.notes && <p className="text-xs text-apple-gray">Notes: {o.notes}</p>}
                </div>
                <button
                  onClick={() => setEditOrder({ ...o })}
                  className="text-apple-blue hover:text-apple-blueHover font-medium text-sm"
                >
                  Edit
                </button>
              </div>
            ))}
            {orders.length === 0 && <p className="text-apple-gray text-sm">No orders yet.</p>}
          </div>
        </div>

        <div id="customers" className="bg-white rounded-3xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-apple-black tracking-tight mb-4">Customers</h2>
          <div className="space-y-4">
            {customers.map((c) => (
              <div key={c.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-apple-black tracking-tight">{c.name || 'Unnamed'} - {c.email}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedCustomer(selectedCustomer === c.id ? null : c.id)}
                      className="text-apple-blue hover:text-apple-blueHover text-sm"
                    >
                      {selectedCustomer === c.id ? 'Hide' : 'View'} Details
                    </button>
                    <button
                      onClick={() => resetCustomerPassword(c.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
                {selectedCustomer === c.id && (
                  <div className="mt-2 pl-4">
                    <p className="text-xs text-apple-gray">Orders:</p>
                    {orders
                      .filter((o) => o.customer_id === c.id)
                      .map((o) => (
                        <p key={o.id} className="text-xs text-apple-black">
                          #{o.id} - {o.total?.toFixed(2) || '0.00'} BHD - {o.status}
                        </p>
                      ))}
                    <p className="text-xs text-apple-gray mt-2">Addresses:</p>
                    {c.addresses.map((a) => (
                      <p key={a.id} className="text-xs text-apple-black">
                        {a.address_line1}, {a.city}, {a.state}, {a.postal_code}, {a.country}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {customers.length === 0 && <p className="text-apple-gray text-sm">No customers yet.</p>}
          </div>
        </div>

        <div id="my-info" className="bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-apple-black tracking-tight mb-4">My Info</h2>
          <form onSubmit={updateAdminInfo} className="grid grid-cols-1 gap-4 max-w-md">
            <input
              placeholder="Name"
              value={adminInfo.name}
              onChange={(e) => setAdminInfo({ ...adminInfo, name: e.target.value })}
              className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
              required
            />
            <input
              placeholder="Email"
              value={adminInfo.email}
              onChange={(e) => setAdminInfo({ ...adminInfo, email: e.target.value })}
              className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-sm"
              required
            />
            <input
              placeholder="New Password (optional)"
              type="password"
              value={adminInfo.password}
              onChange={(e) => setAdminInfo({ ...adminInfo, password: e.target.value })}
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
  );
}