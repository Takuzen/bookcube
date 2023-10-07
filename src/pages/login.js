import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';

function getErrorMessage(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address. Please enter a valid email.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'User not found. Please check your email and password.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    default:
      return 'An error occurred. Please try again.';
  }
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully!');
      router.push('/');
    } catch (error) {
      const errorMessage = error.code ? getErrorMessage(error.code) : 'An error occurred. Please try again.';
      setError(errorMessage);
      console.error('Error logging in:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f2f2f2' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="submit"
            style={{ display: 'block', width: '100%', padding: '10px', backgroundColor: '#f5bf34', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
          >
            Login
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <Link href="/signup">
            <p>Don&apos;t have an account? Sign Up</p>
          </Link>
        </div>
      </div>
    </div>
  );
}