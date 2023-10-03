import Link from 'next/link'
import { useState, useEffect } from 'react'
import Search from './search'
import { useRouter } from 'next/router'

export default function Create() {
  const [boxes, setBoxes] = useState([1]);
  const [cubeDescription, setCubeDescription] = useState("");
  const [addedBooks, setAddedBooks] = useState({});
  const router = useRouter();  // Initialize router

  const generateCube = () => {
    router.push({
      pathname: '/generated',
      query: { books: JSON.stringify(addedBooks) }
    });
  };

  const addBook = (book, boxIndex) => {
    setAddedBooks({
      ...addedBooks,
      [boxIndex]: book
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

  const isGenerateDisabled = Object.keys(addedBooks).length === 0;

  const generateCubeQuery = {
    pathname: '/generated',
    query: { books: JSON.stringify(addedBooks) },
  };

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
      <main className="flex min-h-screen flex-col items-center p-24 gap-10">
        <p></p>
        <div className="font-bold font-serif text-4xl">
          <input 
            type="text" 
            placeholder="This cube is about ..." 
            value={cubeDescription} 
            onChange={(e) => setCubeDescription(e.target.value)} 
          />
        </div>
        {boxes.map((box, index) => (
          <div key={index} className="border-2 border-black rounded-lg w-72 h-48 mr-4">
            {addedBooks[index] ? (
              <>
                <img src={addedBooks[index].localThumbnail} alt={`${addedBooks[index].title} cover`} />
                <h2>{addedBooks[index].title}</h2>
                <p>{addedBooks[index].author}</p>
                <button onClick={() => removeBook(index)} className="bg-red-500 text-white rounded px-2 py-1">Remove</button>
              </>
            ) : (
              <>
                <div className="bg-black text-white p-2 text-center">
                  {`Face ${box}`}
                </div>
                <div className="p-4">
                  <Search addBook={(book) => addBook(book, index)} />
                </div>
              </>
            )}
          </div>
        ))}
        {boxes.length === 6 && <div className="text-center text-red-500">For this moment, you can only add 6 books per cube. We are improving.</div>}
        {boxes.length < 6 && (
          <div className="self-center hover:bg-base hover:text-white hover:cursor-pointer hover:transition hover:delay-50 px-3 py-1 text-black font-medium text-2xl rounded-full">
            <button onClick={addBox}><p>+</p></button>
          </div>
        )}
        <div>
          <Link href={isGenerateDisabled ? '' : generateCubeQuery} className={isGenerateDisabled ? 'opacity-50 cursor-not-allowed' : ''}>
              Generate Cube
          </Link>
        </div>
      </main>
    </>
  )
}