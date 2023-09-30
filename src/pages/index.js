import { Inter } from 'next/font/google'
import Head from 'next/head';
import Link from 'next/link'
import BookCube from './cubeRender';
import Search from './search';

const inter = Inter({ subsets: ['latin'] })

export default function Detail() {
    return (
    <>
      <Head>
        <title>BookCube</title>
        <meta name="description" content="本のキューブ" />
      </Head>
      <main
        className={`flex min-h-[100vh] flex-col items-center p-24 gap-10 ${inter.className}`}
      >
        <div className="font-bold font-serif text-4xl">
          <h1>
            Book Cube
          </h1>
        </div>
        
        <div className="z-10 flex flex-col justify-center" style={{ width: '500px', height: '500px' }}>
          <div> 
            <BookCube />
          </div> 
          <div className="self-center">
            <Link href="/detail">
              <button className="mt-10 bg-white hover:bg-red-300 text-black font-bold font-serif py-3 px-5 rounded">
                詳しく見る
              </button>
            </Link>
          </div>
          <div className="self-center">
            <Search />
          </div>
        </div>
        
      </main>
      </>
    )
  }
