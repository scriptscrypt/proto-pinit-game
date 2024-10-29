"use client"

import dynamic from 'next/dynamic'

// Dynamically import the component that uses window with ssr disabled
const GameLayout = dynamic(
  () => import('../components/GameLayoutLeaflet'),
  { ssr: false }
)

export default function Home() {
  return (
    <main>
      <GameLayout />
    </main>
  )
}
