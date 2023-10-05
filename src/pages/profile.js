import React, { useState, useEffect } from 'react';
import { auth, db } from './utils/firebase';
import { getDoc, doc } from 'firebase/firestore';
import Image from 'next/image';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          setUserInfo(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("No user is signed in.");
      }
    });

    return () => unsubscribe();  // Cleanup subscription
  }, []);
  
  return (
    <div>
      <div style={{ width: '20%', float: 'left', height: '100vh', backgroundColor: '#f2f2f2' }}>
        <p>Profile</p>
      </div>
      <div style={{ width: '80%', float: 'left', padding: '20px' }}>
        {userInfo ? (
          <>
            <h2>User Profile</h2>
            <Image src="/default_profile_image.png" alt="Profile Default Image" width={100} height={100} />
            <p>Username: {user.displayName}</p>
            <p>Name: {userInfo.givenName} {userInfo.familyName}</p>
            <p>Email: {user.email}</p>
            {/* Add your cubes feed here */}
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
}