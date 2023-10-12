import React, { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';

const Search = ({ addBook }) => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeResults = () => {
    setShowResults(false);
  };

  // Updated fetchLocalImage function
  const fetchLocalImage = async (url) => {
    try {
      // Modify URL to request higher quality image
      const highQualityUrl = url.replace('zoom=1', 'zoom=2');
      const res = await fetch(`/api/fetchImage?imageUrl=${encodeURIComponent(highQualityUrl)}`);
      const data = await res.json();
      return data.data;
    } catch (error) {
      console.error('Failed to fetch local image:', error);
      return null;
    }
  };

  const searchBooks = async () => {
    if (!query || query.trim() === '') {
      console.log("Query cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const apikey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      const result = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apikey}`);

      if (result.data && result.data.items) {
        const newBooks = await Promise.all(result.data.items.map(async (book) => {
          const info = book.volumeInfo;
          const localThumbnail = info.imageLinks ? await fetchLocalImage(info.imageLinks.thumbnail) : null;
          return {
            title: info.title,
            author: info.authors ? info.authors.join(', ') : 'Unknown Author',
            thumbnail: info.imageLinks ? info.imageLinks.thumbnail : null,
            localThumbnail,
          };
        }));

        setBooks(newBooks);
        setShowResults(true);
      } else {
        console.error('Invalid API response:', result);
      }
    } catch (error) {
      console.error('Axios error:', error);
    }

  setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchBooks();
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col justify-center gap-4'>
          <div className=''>
            <input type="text" placeholder='* Title, etc...' value={query} onChange={(e) => setQuery(e.target.value)} className='caret-[#f5bf34] focus:outline-none' />
          </div>
          <div className='bg-[#f5bf34] text-white font-serif font-black rounded-full text-center px-4 py-2 hover:opacity-70 hover: cursor-pointer focus:opacity-70'>  
            <button type="submit">Search Books</button>
          </div>
        </div>
      </form>
      { (loading || showResults) && (
        <div className="absolute top-full left-1/3 mt-16 bg-white p-4 rounded shadow-lg overflow-y-auto w-[800px] max-h-[600px] z-10">
          <button onClick={closeResults} className="absolute top-1 right-1 bg-gray-400 text-white rounded-full w-5 h-5 flex items-center justify-center">
            X
          </button>
          {loading ? (
            <div className="animation-container absolute top-0">
              <div className="bouncing-ball"></div>
              <div className="bouncing-ball"></div>
              <div className="bouncing-ball"></div>
            </div>
          ) : (
            books.map((book, index) => (
              <div key={index} className="p-2">
                {book.localThumbnail ? 
                  <Image src={book.localThumbnail} alt={`${book.title} cover`} width={100} height={130} className="mb-2"/> 
                  : <p>No Thumbnail</p>
                }
                <h2>{book.title}</h2>
                <p>{book.author}</p>
                <button onClick={() => addBook(book)} className="bg-blue-500 text-white rounded px-2 py-1">Add</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Search;