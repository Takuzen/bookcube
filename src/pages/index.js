import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Detail() {
    return (
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
            <model-viewer
              style={{ width: '500px', height: '500px' }}
              src="/scene.glb"
              width="500px"
              height="500px"
              alt="A 3D model of a table with food on it"
              ar
              shadow-intensity="1"
              camera-controls
              touch-action="pan-y">  
            </model-viewer>
          </div> 
          <div className="self-center">
            <a href="/detail">
              <button class="mt-10 bg-white hover:bg-red-300 text-black font-bold font-serif py-3 px-5 rounded">
                詳しく見る
              </button>
            </a>
          </div>
        </div>
        
      </main>
    )
  }
