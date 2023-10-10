import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default function Home() {
  const { userId } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [cubes, setCubes] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return (
    <>
      <Head>
        <title>BookSP</title>
        <meta name="description" content="本のキューブ" />
      </Head>
      <main className="flex min-h-[100vh] flex-col items-start p-10 gap-10">
        <section className="flex justify-between w-full">
        <div className="flex gap-1 font-bold font-serif text-3xl">
          <p className='tracking-wide'>
            Book
          </p>
          <p>
            SP
          </p>
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
        <section id="weekly-pick" className="z-10 py-5 gap-7 flex flex-col justify-center bg-[#d7ecea] w-[100%]">
          <div className='self-center'>
            <p className='text-[#DB4D6D] font-black font-serif text-3xl'>Weekly Pick</p>
          </div>
          <div className='self-center'> 
            { isClient ? 
            <model-viewer
              style={{ height: '300px' }}
              src="https://firebasestorage.googleapis.com/v0/b/booksp-eae3c.appspot.com/o/users%2FNupoAf7FpgPdbxVH2p9VitTJnWj1%2Fcubes%2FHugo%202023%20Nominees%2FHugo%202023%20Nominees.glb?alt=media&token=d42d6e6f-37eb-4b97-824d-7a92170cdf57"
              alt="Your 3D model"
              width="200px"
              height="200px"
              auto-rotate
              rotation-per-second="30deg"
              camera-controls
              camera-orbit="45deg 55deg 20m"
              shadow-intensity="1"></model-viewer>
              : 'Loading model...' }
          </div>
          <div className="flex flex-col gap-7">
          <div className='self-center'>
            <Link href="">
              <p>@booksp.offcial</p>
            </Link>
          </div>
          <div className="self-center w-[500px]">  
            <p className="">
              These six books are selected for 2023 Hugo Award, which is the most prestigious award for science fiction and fantasy.
            </p>
            <br />
            <p>
              The announcement of the winner will be on October 21th.
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
        <section id="cube-feed" className="z-10 py-5 gap-7 flex flex-col justify-center bg-[#d7ecea] w-[100%]">
          {/* The Latest to Old Cube Feeds */}
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
