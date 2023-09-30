import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);

  const searchBooks = async () => {
    if (!query || query.trim() === '') {
      console.log("Query cannot be empty");
      return;
    }

    try {
      const result = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);

      if (result.data && result.data.items) {
        const newBooks = result.data.items.map((book) => {
          const info = book.volumeInfo;
          return {
            title: info.title,
            author: info.authors ? info.authors.join(', ') : 'Unknown Author',
            thumbnail: info.imageLinks ? info.imageLinks.thumbnail : null,
          };
        });

        setBooks(newBooks);
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
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit">Search</button>
      </form>
      <div>
        {books.map((book, index) => (
          <div key={index}>
            {book.thumbnail ? <img src={book.thumbnail} alt={`${book.title} cover`} /> : <p>No Thumbnail</p>}
            <h2>{book.title}</h2>
            <p>{book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;