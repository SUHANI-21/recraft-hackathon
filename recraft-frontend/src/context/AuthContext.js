'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { register as apiRegister, login as apiLogin } from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('recraft_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
    setLoading(false);
  }, []);

  const signup = async (userData) => {
    try {
      const data = await apiRegister(userData);
      if (data && data.token) {
        localStorage.setItem('recraft_user', JSON.stringify(data));
        setUser(data);
        return data;
      }
    } catch (error) {
      console.error("Signup failed:", error.message);
      // --- THIS IS THE FIX ---
      // This makes sure the page component knows there was an error.
      throw error; 
    }
  };

  const login = async (email, password) => {
    try {
      const data = await apiLogin({ email, password });
      if (data && data.token) {
        localStorage.setItem('recraft_user', JSON.stringify(data));
        setUser(data);
        return data;
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      // --- THIS IS THE FIX ---
      // This makes sure the page component knows there was an error.
      throw error; 
    }
  };

  const logout = () => {
    localStorage.removeItem('recraft_user');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}