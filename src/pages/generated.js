import { useRouter } from 'next/router';
import BookCube from './cubeRender';

export default function Generated() {
  const router = useRouter();
  const { books } = router.query;
  let addedBooks = {};

  // Parse books only if the query parameter exists
  if (books) {
    try {
      addedBooks = JSON.parse(books);
    } catch (error) {
      console.error('Failed to parse books:', error);
    }
  }

  return (
    <div>
      <BookCube addedBooks={addedBooks} />
    </div>
  );
}