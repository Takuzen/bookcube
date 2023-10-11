import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export default function Home() {
  const { userId } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [cubes, setCubes] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'allcubes'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const cubesData = [];
      querySnapshot.forEach((doc) => {
        cubesData.push({ id: doc.id, ...doc.data() });
      });
      setCubes(cubesData);
    };
  
    fetchData();
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
        <div className="self-center flex gap-1 font-serif text-2xl">
          <p className='self-end tracking-wide mr-2'>
            BookSP
          </p>
          <p className='tracking-wide font-black text-3xl'>
            Facade
          </p>
        </div>
        <div id="auth" className="flex gap-10 items-center">
          {userId ? (
            <div>
              <Link href="/profile">
                <Image
                  src="/person-circle-outline.svg"
                  alt="Default Profile Image"
                  width={30}
                  height={30}
                  className="rounded-full"
                  priority
                />
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login">
                <div className="">Log In</div>
              </Link>
              <Link href="/signup">
                <div className="bg-[#f5bf34] text-white font-bold px-5 py-2 rounded-lg hover:opacity-70">Sign Up</div>
              </Link>
            </>
          )}
        </div>
        </section>
        <section id="weekly-pick" className="z-10 py-5 gap-7 flex flex-col justify-center bg-[#d7ecea] w-[100%]">
          <div className='self-center pt-5'>
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
              camera-orbit="45deg 90deg 20m"
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
        <section id="cube-feed" className="z-20 py-5 gap-7 flex flex-col justify-center w-[100%]">
        <div className="flex flex-wrap justify-center gap-5">
          {cubes.length ? (
            cubes.map((cube) => (
              <div key={cube.id} className='flex flex-col'>
                <p className='self-start font-serif'>{cube.username}</p>
                { isClient ? 
                  <model-viewer
                    style={{ height: '200px' }}
                    src={cube.gltfUrl}
                    alt={cube.cubeCaption}
                    width="100px"
                    height="100px"
                    rotation-per-second="30deg"
                    camera-orbit="45deg 45deg 20m"
                    shadow-intensity="1"
                  ></model-viewer>
                : 'Loading model...' }
                <p className='self-center font-serif'>{cube.cubeCaption}</p>
              </div>
            ))
          ) : (
            <p>Loading cubes...</p>
          )}
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
