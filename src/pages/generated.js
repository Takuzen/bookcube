import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const useGltfUrl = (userId, cubeName) => {
  const [gltfUrl, setGltfUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && cubeName) {
      const fetchGltfUrl = async () => {
        const db = getFirestore();
        const cubeDocRef = doc(db, `users/${userId}/cubes/${cubeName}`);
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
          setLoading(false);  // Ensure loading is set to false in all cases
        }
      };
      fetchGltfUrl();
    }
  }, [userId, cubeName]);

  return { gltfUrl, loading };
};

export default function Generated() {
  const router = useRouter();
  const { userId, cubeName } = router.query;

  const { gltfUrl, loading } = useGltfUrl(userId, cubeName);

  useEffect(() => {
    // This useEffect will re-run whenever router.query changes
    // ensuring that useGltfUrl hook is called with updated values
  }, [router.query]);

  return (
    <div className="flex flex-col items-center h-screen pt-20">
      <div className="w-150 h-150">
        {loading ? (
          <p>Loading...</p>
        ) : (
          gltfUrl && (
            <model-viewer
              src={gltfUrl}
              alt="A 3D model of a cube"
              auto-rotate
              camera-controls
              exposure="0.75"
            ></model-viewer>
          )
        )}
      </div>
    </div>
  );
}