import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Home() {
  const { userId } = useContext(AuthContext);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <>
      <Head>
        <title>BookCube</title>
        <meta name="description" content="本のキューブ" />
      </Head>
      <main className="flex min-h-[100vh] flex-col items-start p-10 gap-10">
        <section className="flex justify-between w-full">
        <div className="font-bold font-serif text-4xl">
          <h1 className='tracking-wide'>
            Book SP
          </h1>
        </div>
        <div id="auth" className="flex gap-10 items-center">
          {userId ? (
            <div>
              <Link href="/profile">
                <Image
                  src="/default_profile_image.png"
                  alt="Default Profile Image"
                  width={50}
                  height={50}
                  className="rounded-full"
                  priority
                />
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login">
                <div className="">Login</div>
              </Link>
              <Link href="/signup">
                <div className="bg-[#f5bf34] text-white font-bold px-5 py-2 rounded-lg hover:opacity-70">Sign Up</div>
              </Link>
            </>
          )}
        </div>
        </section>
        <section id="weekly-pick" className="z-10 gap-7 flex flex-col justify-center bg-[#d7ecea] w-[100vw]">
          <div className='self-center'>
            <p className='text-[#DB4D6D] font-black font-serif text-xl'>Weekly Pick</p>
          </div>
          <div className='self-center'> 
            { isClient ? <model-viewer src="/scene.glb" alt="Your 3D model" width="300px" height="300px" auto-rotate rotation-per-second="30deg" camera-controls camera-orbit="45deg 55deg 4m" shadow-intensity="1"></model-viewer> : 'Loading model...' }
          </div>
          <div className="flex flex-col gap-7">
          <div className='self-center'>
            <Link href="">
              <p>@booksp.offcial</p>
            </Link>
          </div>
          <div className="">  
            <p className="">
              These six books are selected for 2023 Hugo Award, which is the most prestigious award for science fiction and fantasy. The announcement of the winner will be on October 21th.
              <span className='text-gray-400'>read more ...</span>
            </p>
          </div>
          <div className="self-center flex flex-col justify-center">
          
            <Link href="/detail">
              <button className=" text-black font-bold font-serif rounded underline-offset-8 underline">
                See details
              </button>
            </Link>
          </div>
          </div>
        </section>
        <div className="self-center">
        {userId ? (
          <Link href="/create">
            <button className="absolute bottom-10 right-10 bg-[#f5bf34] hover:opacity-70 text-white font-bold font-serif py-4 px-12 rounded-full">
              Create Your Cube
            </button>
          </Link>
        ) : (
          <Link href="/login">
            <button className="absolute bottom-10 right-10 bg-[#f5bf34] hover:opacity-70 text-white font-bold font-serif py-4 px-12 rounded-full">
              Create Your Cube
            </button>
          </Link>
        )}
      </div>
      </main>
      </>
    )
  }
