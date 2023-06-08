import Image from 'next/image'

import NavBar from '../layout/navbar.js'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Image
        src="/ubclogo.png"
        alt="ubc logo"
        width={100}
        height={20}
      >
      </Image>
    </main>
  )
}
