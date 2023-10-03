import React, { useState } from 'react';
import axios from 'axios';

const Search = ({ addBook }) => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const closeResults = () => {
    setShowResults(false);
  };

  const fetchLocalImage = async (url) => {
    try {
      const res = await fetch(`/api/fetchImage?imageUrl=${encodeURIComponent(url)}`);
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

    try {
      const apikey = process.env.GOOGLE_API_KEY
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
        setShowResults(true);  // Show results when search is done
      } else {
        console.error('Invalid API response:', result);
      }
    } catch (error) {
      console.error('Axios error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchBooks();
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col justify-center gap-4'>
          <div className='border rounded'>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className='bg-basedark text-white font-serif font-black rounded-full text-center px-4 py-2 hover:bg-base hover: cursor-pointer focus:opacity-70'>  
            <button type="submit">Search Books</button>
          </div>
        </div>
      </form>
      {showResults && (
        <div className="absolute top-full left-1/3 mt-16 bg-white p-4 rounded shadow-lg overflow-y-auto w-[800px] h-[600px] z-10">
          <button onClick={closeResults} className="absolute top-1 right-1 bg-gray-400 text-white rounded-full w-5 h-5 flex items-center justify-center">
            X
          </button>
          {books.map((book, index) => (
            <div key={index} className="p-2">
              {book.localThumbnail ? <img src={book.localThumbnail} alt={`${book.title} cover`} /> : <p>No Thumbnail</p>}
              <h2>{book.title}</h2>
              <p>{book.author}</p>
              <button onClick={() => addBook(book)} className="bg-blue-500 text-white rounded px-2 py-1">Add</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;