'use client'

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { BlinkCard } from "@/components/blink/blink-card"
import { AddBlinkCard } from "@/components/blink/add-blink-card"
import { Skeleton } from "@/components/ui/skeleton"

interface Blink {
  _id: string
  title: string
  description: string
  privateKey: boolean
  mint: boolean
}

export default function Page() {
  const { publicKey } = useWallet()
  const [blinks, setBlinks] = useState<Blink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (publicKey) {
      fetchBlinks()
    } else {
      setBlinks([])
      setLoading(false)
    }
  }, [publicKey])

  const fetchBlinks = async () => {
    try {
      setLoading(true)

      // Fetch data from the API
      const response = await fetch(`/api/actions/get-blinks?wallet=${publicKey?.toString()}`)

      // Check if the response status is OK (200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Read the response as text first, to inspect it
      const responseText = await response.text()
      console.log('API response:', responseText)  // Log the raw response to inspect it

      // Try to parse it as JSON
      const data = JSON.parse(responseText)
      const { blinks } = data
      setBlinks(blinks)
    } catch (error) {
      console.error("Error fetching blinks:", error)
      // Handle error here, maybe show an error message to the user
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20">
      {/* Title Section */}
      <div className="flex flex-col items-center mt-16">
        <h1 className="text-4xl font-bold text-center mb-4">
          Your Blinks
        </h1>
        <p className="text-lg text-gray-600 text-center">
          View and manage your blinks below
        </p>
      </div>

      {/* Content Section */}
      {!publicKey ? (
        <div className="text-center text-gray-500 mt-8">
          <p className="mb-4">Connect your wallet to view your Blinks</p>
          <button className="bg-white hover:bg-gray-100 text-black font-medium py-2 px-4 rounded">
            Select Wallet
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-48" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {blinks.map((blink) => (
            <BlinkCard key={blink._id} blink={blink} />
          ))}
          <AddBlinkCard onAdd={fetchBlinks} />
        </div>
      )}
    </div>
  )
}
