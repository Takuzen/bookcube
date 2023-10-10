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
      <div className='flex flex-col pt-10 text-white font-bold' style={{ width: '10%', float: 'left', height: '100vh', backgroundColor: '#f0b699' }}>
        <p className='self-center text-lg hover: cursor-pointer hover:underline hover:underline-offset-8'>Main</p>
      </div>
      <div className="flex flex-col" style={{ width: '90%', float: 'left', padding: '20px' }}>
        {userInfo ? (
          <>
            <div className="flex flex-col items-center gap-7 pt-10">
              <h2>User Profile</h2>
              <Image src="/default_profile_image.png" alt="Profile Default Image" width={100} height={100} priority/>
              <p>Username: {userInfo.username}</p>
              <p>Name: {userInfo.givenName} {userInfo.familyName}</p>
              <p>Email: {userInfo.email}</p>
            </div>
            <div id="profile-cube-feed">
              {/* Cube Feed */}
            </div>
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
}