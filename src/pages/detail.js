import { Inter } from 'next/font/google'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex flex-wrap min-h-[100vh] max-w-[100vw] gap-5 items-center justify-center p-24 ${inter.className}`}
    >
      <div className="">
        <Image
          src="/book-sample-0.png"
          alt="book-sample-0"
          width={300}
          height={315}>
        </Image>
        </div>
        <div className="">
        <Image
          src="/book-sample-1.png"
          alt="book-sample-1"
          width={300}
          height={315}>
        </Image>
        </div>
        <div className="">
        <Image
          src="/book-sample-2.png"
          alt="book-sample-2"
          width={300}
          height={315}>
        </Image>
        </div>
        <div className="">
        <Image
          src="/book-sample-3.png"
          alt="book-sample-3"
          width={300}
          height={315}>
        </Image>
        </div>
        <div className="">
        <Image
          src="/book-sample-4.png"
          alt="book-sample-4"
          width={300}
          height={315}>
        </Image>
        </div>
        <div className="">
        <Image
          src="/book-sample-5.png"
          alt="book-sample-5"
          width={300}
          height={315}>
        </Image>
        </div>

    </main>
  )
}
