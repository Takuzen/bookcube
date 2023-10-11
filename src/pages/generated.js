import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getFirestore, doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

const useGltfUrl = (userId, cubeCaption) => {
  const [gltfUrl, setGltfUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && cubeCaption) {
      const fetchGltfUrl = async () => {
        const db = getFirestore();
        const cubeDocRef = doc(db, `users/${userId}/cubes/${cubeCaption}`);
        try {
          const cubeDoc = await getDoc(cubeDocRef);
          if (cubeDoc.exists()) {
            const data = cubeDoc.data();
            setGltfUrl(data.gltfUrl);
          } else {
            console.error('No such document!');
          }
        } catch (error) {
          console.error('Error fetching document:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchGltfUrl();
    }
  }, [userId, cubeCaption]);

  return { gltfUrl, loading };
};

export default function Generated() {
  const router = useRouter();
  const { userId, cubeCaption } = router.query;

  const { gltfUrl, loading } = useGltfUrl(userId, cubeCaption);

  const handlePost = async () => {
    const db = getFirestore();
    const userDocRef = doc(db, `users/${userId}`);
    let username = '';
    
    try {
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        username = userDoc.data().username;
      } else {
        console.error('No such user document!');
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
    }
  
    try {
      await addDoc(collection(db, 'allcubes'), {
        userId,
        username,
        cubeCaption,
        gltfUrl,
        createdAt: serverTimestamp(),
      });
      console.log('Cube successfully posted to allcubes collection!');
    } catch (error) {
      console.error('Error posting cube:', error);
    }
  };

  useEffect(() => {
    // This useEffect will re-run whenever router.query changes
    // ensuring that useGltfUrl hook is called with updated values
  }, [router.query]);

  return (
    <div className="flex flex-col items-center h-screen pt-20">
      <div className="">
        {loading ? (
          <p>Loading...</p>
        ) : (
          gltfUrl && (
            <model-viewer
              src={gltfUrl}
              style={{ height: '300px' }}
              alt="A 3D model of a cube"
              auto-rotate
              camera-controls
              exposure="0.75"
            ></model-viewer>
          )
        )}
      </div>
      <div>
        <p>{cubeCaption}</p>
      </div>
      <div>
        <button onClick={() => handlePost(userId, cubeCaption, gltfUrl)}>Post</button>
        {/* Share Button */}
      </div>
    </div>
  );
}