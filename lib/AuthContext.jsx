// lib/AuthContext.jsx
"use client"; // Add this directive

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase'; // Import Firebase auth
import { onAuthStateChanged } from 'firebase/auth';

// Create the Auth Context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State for user
  const [loading, setLoading] = useState(true); // Loading state

  // Effect to monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Update user state
      setLoading(false); // Set loading to false after checking auth state
    });
    
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Provide the user and loading state to children
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);
