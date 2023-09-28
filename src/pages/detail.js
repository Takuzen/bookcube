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
        
        <div className="z-10" style={{ width: '500px', height: '500px' }}>
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
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Button
          </button>
        </div>
        
      </main>
    )
  }