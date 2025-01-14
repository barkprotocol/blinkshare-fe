'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { BlinkCard } from "@/components/blink/blink-card"
import { AddBlinkCard } from "@/components/blink/add-blink-card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"

interface Blink {
  _id: string
  title: string
  description: string
  privateKey: boolean
  mint: boolean
}

export default function MyBlinksPage() {
  const { publicKey, connected } = useWallet()
  const [blinks, setBlinks] = useState<Blink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    document.title = "My Blinks - BlinkShare"
    if (connected && publicKey) {
      fetchBlinks()
    } else {
      setBlinks([])
      setLoading(false)
    }
  }, [connected, publicKey])

  const fetchBlinks = async () => {
    if (!publicKey) return

    try {
      setLoading(true)
      setError(false)
      const response = await fetch(`/api/actions/get-blinks?wallet=${publicKey.toString()}`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setBlinks(data.blinks || [])
    } catch (error) {
      console.error("Error fetching blinks:", error)
      setError(true)
      toast({
        title: "Error",
        description: "Failed to fetch blinks. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex flex-col items-center mt-16 mb-12">
        <h1 className="text-4xl font-bold text-center mb-4">Your Blinks</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8">
          View and manage your blinks below
        </p>
        {!connected && (
          <div className="text-center">
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Connect your wallet to view your Blinks
            </p>
            <WalletMultiButton className="!bg-black !text-white hover:!bg-gray-800 dark:!bg-white dark:!text-black dark:hover:!bg-gray-200" />
          </div>
        )}
        {/* Buttons for My Blinks and Blink Generator */}
        <div className="mt-8 flex space-x-4">
          <button
            onClick={() => router.push("/my-blinks")}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none transition"
            aria-label="Navigate to My Blinks"
          >
            My Blinks
          </button>
          <button
            onClick={() => router.push("/blink-generator")}
            className="px-6 py-2 bg-white text-black border border-black rounded-lg hover:bg-gray-100 focus:outline-none transition"
            aria-label="Navigate to Blink Generator"
          >
            Blink Generator
          </button>
        </div>
      </div>

      {connected && (
        <>
          {loading ? (
            <>
              <p className="text-center text-gray-500">Loading your blinks...</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <Skeleton key={index} className="h-48" />
                ))}
              </div>
            </>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-500">Failed to load blinks. Please try again.</p>
              <button
                onClick={fetchBlinks}
                className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blinks.length > 0 ? (
                blinks.map((blink) => <BlinkCard key={blink._id} blink={blink} />)
              ) : (
                <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                  No Blinks found
                </p>
              )}
              <AddBlinkCard onAdd={fetchBlinks} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
