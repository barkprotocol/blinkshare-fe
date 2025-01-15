'use client'

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { BlinkCard } from "@/components/blink/blink-card"
import { AddBlinkCard } from "@/components/blink/add-blink-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RefreshCw, Plus } from 'lucide-react'
import { WalletButton } from "@/components/ui/wallet-button"

interface Blink {
  id: string
  title: string
  description: string
  icon: string
  wallet: string
  mint: string
  created_at: string
}

export default function MyBlinksPage() {
  const { publicKey, connected } = useWallet()
  const [blinks, setBlinks] = useState<Blink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const fetchBlinks = useCallback(async () => {
    if (!publicKey) return

    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/actions/get-blinks?wallet=${publicKey.toString()}`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      setBlinks(data.blinks || [])
    } catch (error) {
      console.error("Error fetching blinks:", error)
      setError("Failed to fetch blinks. Please try again later.")
      toast({
        title: "Error",
        description: "Failed to fetch blinks. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [publicKey, toast])

  useEffect(() => {
    if (connected && publicKey) {
      fetchBlinks()
    } else {
      setBlinks([])
      setLoading(false)
    }
  }, [connected, publicKey, fetchBlinks])

  const handleCreateBlink = () => {
    router.push("/blink-generator")
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Your Blinks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground text-center mb-6">
            View and manage your blinks below
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => router.push("/my-blinks")}
              variant="default"
              className="w-40"
            >
              My Blinks
            </Button>
            <Button
              onClick={handleCreateBlink}
              variant="outline"
              className="w-40"
            >
              Blink Generator
            </Button>
          </div>
        </CardContent>
      </Card>

      {!connected ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="mb-4 text-muted-foreground">
              Connect your wallet to view your Blinks
            </p>
            <WalletButton />
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="space-y-4">
          <p className="text-center text-muted-foreground flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading your blinks...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Skeleton key={index} className="h-48" />
            ))}
          </div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="text-center py-6">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchBlinks} variant="default" className="w-40">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blinks.length > 0 ? (
            <>
              {blinks.map((blink) => <BlinkCard key={blink.id} blink={blink} onDelete={fetchBlinks} />)}
              <AddBlinkCard onAdd={handleCreateBlink} />
            </>
          ) : (
            <Card className="col-span-full">
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No Blinks found. Create your first Blink using the Blink Generator!
                </p>
                <Button
                  onClick={handleCreateBlink}
                  variant="default"
                  className="w-40"
                >
                  Create Blink
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      <Button
        onClick={handleCreateBlink}
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg"
      >
        <Plus className="h-8 w-8" />
        <span className="sr-only">Create New Blink</span>
      </Button>
    </div>
  )
}

