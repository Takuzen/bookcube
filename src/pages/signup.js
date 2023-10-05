import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { auth, db } from "./utils/firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

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
    case 'auth/email-already-in-use':
      return 'This email is already in use.';
    case 'auth/weak-password':
      return 'Weak password.';
    default:
      return 'An error occurred. Please try again.';
  }
}

export default function SignUp() {
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      const docRef = doc(db, 'users', user.uid);
  
      await setDoc(docRef, {
        userId: user.uid,
        email: user.email,
        givenName,
        familyName,
      });
  
      console.log('User signed up successfully!');
      router.push('/profile');
    } catch (error) {
      const errorMessage = error.code ? getErrorMessage(error.code) : 'An error occurred. Please try again.';
      setError(errorMessage);
      console.error('Error signing up:', error);
    }
  };
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f2f2f2' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign Up</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <form onSubmit={handleSignUp}>
          <input
            style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}
            type="text"
            placeholder="Given Name"
            value={givenName}
            onChange={(e) => setGivenName(e.target.value)}
          />
          <input
            style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}
            type="text"
            placeholder="Family Name"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
          />
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
}