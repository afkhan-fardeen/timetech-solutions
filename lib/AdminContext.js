// lib/AdminContext.js
'use client';
import { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  // Load session from localStorage immediately on initialization
  const initialSession = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('adminSession') || 'null') : null;
  const [adminSession, setAdminSession] = useState(initialSession);

  const updateAdminSession = (data) => {
    setAdminSession(data);
    if (data) {
      localStorage.setItem('adminSession', JSON.stringify(data));
    } else {
      localStorage.removeItem('adminSession');
    }
  };

  const logout = () => {
    updateAdminSession(null);
  };

  return (
    <AdminContext.Provider value={{ adminSession, updateAdminSession, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdminSession = () => useContext(AdminContext);