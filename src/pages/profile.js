import Image from 'next/image';
import React, { useEffect, useContext, useState } from 'react';
import { db } from '../lib/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { AuthContext } from '../contexts/AuthContext';

export default function Profile() {
  const { userId } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserInfo(docSnap.data());
        } else {
          console.log("No such document!");
        }
      };
      fetchData();
    } else {
      console.log("No user is signed in.");
    }
  }, [userId]);

  return (
    <div>
      <div style={{ width: '20%', float: 'left', height: '100vh', backgroundColor: '#f2f2f2' }}>
        <p>Profile</p>
      </div>
      <div style={{ width: '80%', float: 'left', padding: '20px' }}>
        {userInfo ? (
          <>
            <h2>User Profile</h2>
            <Image src="/default_profile_image.png" alt="Profile Default Image" width={100} height={100} priority/>
            <p>Username: {userInfo.displayName}</p>
            <p>Name: {userInfo.givenName} {userInfo.familyName}</p>
            <p>Email: {userInfo.email}</p>
            {/* Add your cubes feed here */}
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
}