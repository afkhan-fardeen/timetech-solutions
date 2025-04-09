// lib/SessionContext.js
'use client';
import { createContext, useContext, useState } from 'react';

const SessionContext = createContext();

export function SessionProvider({ children }) {
  // Load session from localStorage immediately on initialization
  const initialSession = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('customerSession') || 'null') : null;
  const [session, setSession] = useState(initialSession);

  const updateSession = (data) => {
    setSession(data);
    if (data) {
      localStorage.setItem('customerSession', JSON.stringify(data));
    } else {
      localStorage.removeItem('customerSession');
    }
  };

  const logout = () => {
    updateSession(null);
  };

  return (
    <SessionContext.Provider value={{ session, updateSession, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);