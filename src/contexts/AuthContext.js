import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);
  
  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};