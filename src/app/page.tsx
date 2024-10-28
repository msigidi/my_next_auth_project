// pages/login.js

"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth } from '../../lib/firebase'; // Import the Firebase auth
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State for authentication status

  // Effect to monitor authentication state
  useEffect(() => {
    // Check localStorage for login status
    const storedLoginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(storedLoginStatus);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true); // User is signed in
        localStorage.setItem('isLoggedIn', 'true'); // Set login status in localStorage
        router.push('/dashboard'); // Redirect to dashboard
      } else {
        setIsLoggedIn(false); // User is signed out
        localStorage.setItem('isLoggedIn', 'false'); // Set login status in localStorage
      }
    });
    
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router]);

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError(''); // Reset error message on each attempt

    // Basic validation
    if (!username || !password) {
      setError("Both email and password are required.");
      return;
    }

    // Authentication with Firebase
    try {
      await signInWithEmailAndPassword(auth, username, password);
      // On successful login, isLoggedIn state will be updated in the effect
    } catch (error) {
      setError("Invalid email or password.");
      console.error("Login error:", error);
    }
  };

  // If the user is already logged in, prevent the rendering of the login form
  if (isLoggedIn) {
    router.push('/dashboard'); // redirect to the dashboard
    return null;
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-green-500 p-6">
      <div className="absolute top-11 left-11 transform hover:scale-105 transition-all duration-300 ease-in-out">
        <Image src="/logo.png" alt="Logo" width={170} height={90} className="opacity-90" />
      </div>

      <div className="text-center mt-16 md:mt-0">
        <h1 className="text-3xl font-semibold text-white drop-shadow-lg mb-2">Welcome to Bulltech</h1>
        <h3 className="text-base text-gray-200 mb-6">Login to access your dashboard</h3>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm bg-white p-8 rounded-xl shadow-lg">
        
        <input
          type="text"
          placeholder="Email Address"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ease-in-out shadow-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ease-in-out shadow-sm"
        />
        {error && <p className="text-red-500 text-center my-2">{error}</p>}
        <button
          type="submit"
          className="p-3 text-lg font-semibold text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Login
        </button>
      </form>
    </div>
  );
}
