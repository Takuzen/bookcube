import Link from 'next/link';
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

  const [showAnimation, setShowAnimation] = useState(true);

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

    router.push('/');
  };

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setShowAnimation(false);
      }, 3000);
    }
    // This useEffect will re-run whenever router.query changes
    // ensuring that useGltfUrl hook is called with updated values
  }, [router.query, loading]);

  return (
    <div className="flex flex-col items-center h-screen pt-20 w-1/3 mx-auto">
      <div className="">
        {loading ? (
          <p>Loading...</p>
        ) : (
          showAnimation ? (
            <div className="animation-container">
              <div className="bouncing-ball"></div>
              <div className="bouncing-ball"></div>
              <div className="bouncing-ball"></div>
            </div>
          ) : (
            <>
              <h1 className="text-4xl text-center font-black text-green-500 mb-10 underline underline-offset-8">Congratulations!</h1>
              <section className="flex flex-col justify-center gap-20">
                <div className='h-[100%] font-serif self-center'>
                  {gltfUrl && (
                    <model-viewer
                      src={gltfUrl}
                      style={{ height: '300px' }}
                      alt="A 3D model of a cube"
                      auto-rotate
                      camera-controls
                      exposure="0.75"
                    ></model-viewer>
                  )}
                </div>
                <div>
                    <p>{cubeCaption}</p>
                  </div>
                <div className='font-serif flex flex-col'>
                  <button onClick={() => handlePost(userId, cubeCaption, gltfUrl)} className='rounded-lg bg-[#f5bf34] text-white px-20 py-3 font-black hover:opacity-70'>
                    Post
                  </button>
                  {/* Share Button */}
                  <div className='self-center flex-col gap-5'>
                    <Link href="/">
                      <p className='text-center mt-7 hover:opacity-70'><span>&#8592;</span> Back to home</p>                      
                    </Link>
                    <p className='text-gray-400 mt-5'><span>&#40;</span>the cube would be only saved in your profile page<span>&#41;</span></p>
                  </div>
                </div>
              </section>
            </>
          )
        )}
      </div>
    </div>
  );  
}