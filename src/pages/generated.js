import { useRouter } from 'next/router';
import { useState, useMemo } from 'react';
import BookCube from './cubeRender';

export default function Generated() {
  const router = useRouter();
  const { books } = router.query;
  const [userId, setUserId] = useState(null);
  const [cubeId, setCubeId] = useState(null);
  const [isWebShareSupported, setIsWebShareSupported] = useState(false);

  const addedBooks = useMemo(() => {
    let parsedBooks = {};
    if (books) {
      try {
        parsedBooks = JSON.parse(books);
      } catch (error) {
        console.error('Failed to parse books:', error);
      }
    }
    return parsedBooks;
  }, [books]);

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const imgURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgURL;
    link.download = 'bookcube.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

const toBlob = (base64) => {
  const decodedData = atob(base64.replace(/^.*,/, ""));
  const buffers = new Uint8Array(decodedData.length);
  for (let i = 0; i < decodedData.length; i++) {
    buffers[i] = decodedData.charCodeAt(i);
  }
  try {
    const blob = new Blob([buffers.buffer], { type: "image/png" });
    return blob;
  } catch (e) {
    return null;
  }
};

const handleShare = () => {
  const canvas = document.querySelector('canvas');
  const dataURL = canvas.toDataURL('image/png');
  const blob = toBlob(dataURL);
  const file = new File([blob], 'image.png', { type: 'image/png' });
  const url = `https://bookcube.vercel.app/cube/${userId}/${cubeId}`;

  if (navigator.share) {
    navigator.share({
      title: 'Check out my cube!',
      url: url,
      files: [file],
    }).catch(error => {
      console.error('Sharing failed', error);
    });
  }
};

  return (
    <div className="flex flex-col items-center h-screen pt-20">
      <div className="w-150 h-150">
        <BookCube addedBooks={addedBooks} />
      </div>
      <div className="mt-5">
        {isWebShareSupported ? (
          <button className="bg-[#f5bf34] text-white px-4 py-2 rounded" onClick={handleShare}>Share</button>
        ) : (
          <button className="bg-[#f5bf34] text-white px-4 py-2 rounded" onClick={handleDownload}>Save in PNG</button>
        )}
      </div>
    </div>
  );
}