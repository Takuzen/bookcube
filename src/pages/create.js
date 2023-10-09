import Image from 'next/image';
import Search from './search';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { db } from '../lib/firebase';
import { collection, setDoc, doc } from 'firebase/firestore';
import { generateAndUploadGLTF } from './cubeRender';

export default function Create() {
  const { userId } = useContext(AuthContext);
  const [boxes, setBoxes] = useState([1]);
  const [cubeName, setCubeName] = useState("");
  const [addedBooks, setAddedBooks] = useState({});
  const router = useRouter();

  const generateCube = async () => {
    console.log('generateCube called');
    if (cubeName) {
      const userRef = doc(db, 'users', userId);
      const cubeRef = doc(userRef, 'cubes', cubeName);
      try {
        await setDoc(cubeRef, { timestamp: Date.now() }, { merge: true });
        const booksCollectionRef = collection(cubeRef, 'books');
        for (let i = 0; i < Object.keys(addedBooks).length; i++) {
          const bookRef = doc(booksCollectionRef, `book_${i}`);
          await setDoc(bookRef, addedBooks[i], { merge: true });
        }

        // Call the exportGLTF function to generate and upload the glTF file
        // Assume the scene object is accessible; replace with your actual scene object
        await generateAndUploadGLTF(addedBooks, userId, cubeName);
        console.log('generateAndUploadGLTF finished');

        console.log('Cube saved successfully');
        router.push('/generated');
        console.log('router.push called');
      } catch (error) {
        console.error('Error saving cube:', error);
      }
    } else {
      console.error('Cube Name is required');
    }
  };  

  const addBook = (book, boxIndex) => {
    setAddedBooks({
      ...addedBooks,
      [boxIndex]: { ...book, caption: '' }
    });
  };

  const updateCaption = (caption, boxIndex) => {
    setAddedBooks({
      ...addedBooks,
      [boxIndex]: { ...addedBooks[boxIndex], caption }
    });
  };

  const removeBook = (boxIndex) => {
    const newAddedBooks = { ...addedBooks };
    delete newAddedBooks[boxIndex];
    setAddedBooks(newAddedBooks);
  };

  const addBox = () => {
    if (boxes.length < 6) {
      setBoxes([...boxes, boxes.length + 1]);
    }
  };

  const isGenerateDisabled = Object.keys(addedBooks).length === 0 || !cubeName;

  useEffect(() => {
    return () => {
      Object.values(addedBooks).forEach((book) => {
        if (book && book.localThumbnail) {
          URL.revokeObjectURL(book.localThumbnail);
        }
      });
    };
  }, [addedBooks]);

  return (
    <>
      <main className="flex min-h-screen flex-col justify-center p-24 gap-10">
        <div className="font-bold font-serif text-4xl mb-4">
          <input 
            type="text" 
            placeholder="Cube Name" 
            value={cubeName} 
            onChange={(e) => setCubeName(e.target.value)} 
          />
          <div className='text-lg'>
          <p>You can add up to 6 books each cube.</p>
        </div>
        </div>
        <div className="flex flex-wrap gap-4">
          {boxes.map((box, index) => (
            <div key={index} className="border border-black rounded-lg w-72 h-auto p-4">
              {addedBooks[index] ? (
                <>
                  <Image 
                    src={addedBooks[index].localThumbnail} 
                    alt={`${addedBooks[index].title} cover`} 
                    width={300} 
                    height={450} 
                    className="w-full mb-2"
                  />
                  <h2>{addedBooks[index].title}</h2>
                  <p>{addedBooks[index].author}</p>
                  <input 
                    type="text" 
                    placeholder="Write a caption..." 
                    value={addedBooks[index].caption} 
                    onChange={(e) => updateCaption(e.target.value, index)}
                  />
                  <button onClick={() => removeBook(index)} className="bg-red-500 text-white rounded px-2 py-1 mt-2">Remove</button>
                </>
              ) : (
                <>
                  <div className="text-black font-bold text-center underline underline-offset-8 decoration-2">
                    {`Face ${box}`}
                  </div>
                  <div className="p-4">
                    <Search addBook={(book) => addBook(book, index)} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        {boxes.length === 6 && <div className="text-center text-red-500">For this moment, you can only add 6 books per cube. We are improving.</div>}
        {boxes.length < 6 && (
          <div className="self-center hover:bg-[#f5bf34] hover:text-white hover:cursor-pointer hover:transition hover:delay-50 px-3 py-1 text-black font-medium text-2xl rounded-full">
            <button onClick={addBox}><p>+</p></button>
          </div>
        )}
      <div>
        <button 
          onClick={generateCube} 
          className={isGenerateDisabled ? 'opacity-50 cursor-not-allowed' : 'text-[#DB4D6D]'}
          disabled={isGenerateDisabled}
        >
          Generate Cube
        </button>
      </div>
      </main>
    </>
  )
}