
import Image from 'next/image';
import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, getDocs } from 'firebase/firestore';

export default function Profile() {
  const { userId } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [cubes, setCubes] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserInfo(docSnap.data());
        }
        const q = query(collection(db, 'users/' + userId + '/cubes'));
        const querySnapshot = await getDocs(q);
        const cubesData = [];
        querySnapshot.forEach((doc) => {
          cubesData.push({ id: doc.id, ...doc.data() });
        });
        setCubes(cubesData);
      };

      fetchData();
    }
  }, [userId]);

  return (
    <div>
      <div className='flex flex-col pt-10 text-white font-bold' style={{ width: '10%', float: 'left', height: '100vh', backgroundColor: '#f0b699' }}>
        <p className='self-center text-lg hover:cursor-pointer underline underline-offset-8'>Main</p>
      </div>
      <div className="flex flex-col" style={{ width: '90%', float: 'left', padding: '20px' }}>
        {userInfo ? (
          <>
            <div className="flex flex-col items-center gap-7 pt-10">
              <h2>User Profile</h2>
              <Image src="/default_profile_image.png" alt="Profile Default Image" width={100} height={100} priority/>
              <p>{userInfo.username}</p>
            </div>
            <div className='flex flex-wrap justify-center gap-5 pt-20 hover:cursor-pointer' id="profile-cube-feed">
              {cubes.map((cube) => (
                <div key={cube.id}>
                  { isClient ? 
                  <model-viewer
                    style={{ height: '200px' }}
                    src={cube.gltfUrl}  // Directly using the complete URL from Firestore
                    alt={cube.name}
                    width="100px"
                    height="100px"
                    rotation-per-second="30deg"
                    camera-orbit="0deg 0deg 20m"
                    shadow-intensity="1"
                  ></model-viewer>
                  : 'Loading model...' }
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </div>
  );
}