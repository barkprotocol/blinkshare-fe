'use client'

import { useState, useEffect, useCallback } from 'react'
import { BlinkCard } from "@/components/blink/blink-card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useRouter } from 'next/navigation'

interface Blink {
  id: string
  title: string
  description: string
  privateKey: boolean
  mint: boolean
}

export default function BlinksList() {
  const [blinks, setBlinks] = useState<Blink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const fetchBlinks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/actions/get-blinks')
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setBlinks(data.blinks || [])
    } catch (error) {
      console.error("Error fetching blinks:", error)
      setError('Failed to fetch blinks. Please try again later.')
      toast({
        title: "Error",
        description: "Failed to fetch blinks. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchBlinks()
  }, [fetchBlinks])

  const handleCreateBlink = () => {
    router.push('/blink-generator')
  }

  const handleDeleteBlink = async (blinkId: string) => {
    try {
      const response = await fetch(`/api/actions/delete-blink/${blinkId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      toast({
        title: "Success",
        description: "Blink deleted successfully.",
        variant: "default",
      })
      fetchBlinks()
    } catch (error) {
      console.error("Error deleting blink:", error)
      toast({
        title: "Error",
        description: "Failed to delete blink. Please try again later.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Loading blinks...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-center text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">{error}</p>
          <Button onClick={fetchBlinks} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Blinks</h1>
      {blinks.length === 0 ? (
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No blinks found.</p>
            <Button onClick={handleCreateBlink} variant="default">
              <Plus className="mr-2 h-4 w-4" />
              Create a Blink
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blinks.map((blink) => (
              <BlinkCard 
                key={blink.id} 
                blink={blink} 
                onDelete={() => handleDeleteBlink(blink.id)}
              />
            ))}
          </div>
          <CardFooter className="flex justify-center mt-8">
            <Button onClick={handleCreateBlink} variant="default">
              <Plus className="mr-2 h-4 w-4" />
              Create New Blink
            </Button>
          </CardFooter>
        </>
      )}
    </div>
  )
}

