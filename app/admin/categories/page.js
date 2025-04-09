'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAdminSession } from '../../../lib/AdminContext';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const { adminSession } = useAdminSession();

  useEffect(() => {
    if (!adminSession) return;
    fetchCategories();
  }, [adminSession]);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('id', { ascending: true });
    if (error) {
      toast.error('Failed to load categories');
      return;
    }
    setCategories(data || []);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('categories').insert([newCategory]);
    if (error) {
      toast.error(error.message.includes('duplicate') ? 'Category already exists' : 'Failed to add category');
      return;
    }
    setNewCategory({ name: '', description: '' });
    fetchCategories();
    toast.success('Category added successfully');
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('categories')
      .update({ name: editingCategory.name, description: editingCategory.description })
      .eq('id', editingCategory.id);

    if (error) {
      toast.error(error.message.includes('duplicate') ? 'Category already exists' : 'Failed to update category');
      return;
    }
    setEditingCategory(null);
    fetchCategories();
    toast.success('Category updated successfully');
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category? Products will be uncategorized.')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete category');
      return;
    }
    fetchCategories();
    toast.success('Category deleted successfully');
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
            <Link href="/admin/categories" className="block text-apple-black font-medium">Categories</Link>
            <Link href="/admin/orders" className="block text-apple-gray hover:text-apple-black transition-colors">Orders</Link>
            <Link href="/admin/customers" className="block text-apple-gray hover:text-apple-black transition-colors">Customers</Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-semibold text-apple-black mb-8 tracking-tight">Category Management</h1>

        <div className="bg-white rounded-xl apple-shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-apple-black mb-4">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-apple-blue text-apple-black"
              required
            />
            <textarea
              placeholder="Description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-apple-blue text-apple-black"
              rows="3"
            />
            <button
              type="submit"
              className="bg-apple-black text-white px-6 py-2 rounded-apple font-medium hover:bg-apple-blue transition-colors apple-shadow"
            >
              Add Category
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl apple-shadow p-6">
          <h2 className="text-xl font-semibold text-apple-black mb-4">Categories</h2>
          {categories.length === 0 ? (
            <p className="text-apple-gray">No categories found.</p>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between border-b border-gray-200 py-4">
                  <div>
                    <p className="text-apple-black font-medium">{category.name}</p>
                    <p className="text-apple-gray text-sm">{category.description || 'No description'}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="text-apple-blue hover:text-apple-blueHover"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-apple-gray hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {editingCategory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl apple-shadow p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold text-apple-black mb-4">Edit Category</h2>
              <form onSubmit={handleEditCategory} className="space-y-4">
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-apple-blue text-apple-black"
                  required
                />
                <textarea
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-apple-blue text-apple-black"
                  rows="3"
                />
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-apple-black text-white px-6 py-2 rounded-apple font-medium hover:bg-apple-blue transition-colors apple-shadow"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
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