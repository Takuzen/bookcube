import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './utils/firebase';
import Image from 'next/image';

export default function Account() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (currentUser) => {
      console.log("Current User:", currentUser);  // Debugging line
      
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        console.log("Document Snapshot:", docSnap);  // Debugging line
  
        if (docSnap.exists()) {
          setUserInfo(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("No user is signed in.");
      }
    });
  }, []);
  

  return (
    <div>
      <div style={{ width: '20%', float: 'left', height: '100vh', backgroundColor: '#f2f2f2' }}>
        <p>Profile</p>
      </div>
      <div style={{ width: '80%', float: 'left', padding: '20px' }}>
        {userInfo && (
          <>
            <h2>User Profile</h2>
            <Image src="/default_profile_image.png" alt="Profile Default Image" width={100} height={100} />
            {/* <img src={user.photoURL || 'default_image_url'} alt="User profile" /> */}
            <p>Username: {user.displayName}</p>
            <p>Name: {userInfo.givenName} {userInfo.familyName}</p>
            <p>Email: {user.email}</p>
            <p>Password: ******</p>
            <p>Description: Your description here</p>
            {/* Add your cubes feed here */}
          </>
        )}
      </div>
    </div>
  );
}