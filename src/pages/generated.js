import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { db, auth } from './utils/firebase';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import BookCube from './cubeRender';

export default function Generated() {
  const router = useRouter();
  const { books } = router.query;
  const [userId, setUserId] = useState(null);
  const [cubeId, setCubeId] = useState(null);
  const [isWebShareSupported, setIsWebShareSupported] = useState(false);
  let addedBooks = {};

  if (books) {
    try {
      addedBooks = JSON.parse(books);
    } catch (error) {
      console.error('Failed to parse books:', error);
    }
  }

  useEffect(() => {
    // Check Web Share API support
    setIsWebShareSupported('share' in navigator);

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserId(user.uid);

        const userRef = doc(db, 'users', user.uid);
        const cubesCollectionRef = collection(userRef, 'cubes');

        try {
          const docRef = await addDoc(cubesCollectionRef, {
            books: addedBooks,
            timestamp: Date.now(),
            // Add any additional fields you need
          });
          setCubeId(docRef.id);
          console.log('Cube saved successfully:', docRef.id);
        } catch (error) {
          console.error('Error saving cube:', error);
        }
      }
    });
  }, [addedBooks]);

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const imgURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgURL;
    link.download = 'cube.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    if (userId && cubeId) {
      const url = `https://bookcube.vercel.app/cube/${userId}/${cubeId}`;
      if (navigator.share) {
        navigator.share({
          title: 'Check out my cube!',
          url: url,
        }).catch((error) => {
          console.error('Sharing failed', error);
        });
      }
    }
  };

  return (
    <div>
      <BookCube addedBooks={addedBooks} />
      {isWebShareSupported ? (
        <button onClick={handleShare}>Share</button>
      ) : (
        <button onClick={handleDownload}>Download Cube</button>
      )}
    </div>
  );
}