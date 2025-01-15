'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useWallet } from '@solana/wallet-adapter-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { BlinkData, currencyIcons } from "@/app/types/blink"
import { Loader2, ExternalLink, RefreshCw } from 'lucide-react'

interface BlinkDisplayProps {
  blinkId: string
}

export function BlinkDisplay({ blinkId }: BlinkDisplayProps) {
  const [blink, setBlink] = useState<BlinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { publicKey, connected } = useWallet()
  const { toast } = useToast()

  const fetchBlinkData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/actions/get-blink/${blinkId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setBlink(data.blink)
    } catch (error) {
      console.error("Error fetching blink:", error)
      setError('Failed to fetch blink data. Please try again later.')
      toast({
        title: "Error",
        description: "Failed to fetch blink data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [blinkId, toast])

  useEffect(() => {
    fetchBlinkData()
  }, [fetchBlinkData])

  const handleAction = async () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to perform this action.",
        variant: "destructive",
      })
      return
    }

    // Implement the action logic here (e.g., payment, donation, or NFT minting)
    toast({
      title: "Action in progress",
      description: "Processing your request...",
    })
  }

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-40 w-40 rounded-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    )
  }

  if (error || !blink) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">{error || 'Blink not found'}</p>
          <Button onClick={fetchBlinkData} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const { icon, label, description, title, titleDescription, font, backgroundColor, fontColor, backgroundImage, buttonOptions, type } = blink

  const cardStyle = {
    backgroundColor,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: fontColor,
  }

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden shadow-lg" style={cardStyle}>
      <CardHeader className="pt-12">
        <CardTitle className="text-3xl sm:text-4xl font-bold text-center mb-2" style={{ fontFamily: font }}>{title}</CardTitle>
        {titleDescription && (
          <p className="text-center text-sm sm:text-base" style={{ fontFamily: font }}>{titleDescription}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40">
          <Image
            src={icon || "/placeholder.svg"}
            alt={label || "Blink icon"}
            fill
            sizes="(max-width: 640px) 128px, 160px"
            style={{ objectFit: "cover" }}
            className="rounded-full"
            priority
          />
        </div>
        <h2 className="text-2xl font-semibold" style={{ fontFamily: font }}>{label}</h2>
        <p className="text-center text-lg max-w-prose" style={{ fontFamily: font }}>{description}</p>
        {type === 'NFT' && blink.mint && (
          <div className="text-center">
            <p className="font-semibold mb-2">NFT Details</p>
            <p className="break-all">Mint Address: {blink.mint}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-4 pb-8">
        {buttonOptions.type !== 'none' && (
          <Button 
            className="w-full max-w-xs sm:max-w-sm" 
            style={{ backgroundColor: fontColor, color: backgroundColor }}
            onClick={handleAction}
          >
            <div className="flex items-center justify-center">
              <Image 
                src={currencyIcons[buttonOptions.currency] || "/placeholder.svg"} 
                alt={`${buttonOptions.currency} icon`}
                width={24} 
                height={24} 
                className="mr-2" 
              />
              <span>{buttonOptions.type === 'payment' ? 'Pay' : 'Donate'} {buttonOptions.amount} {buttonOptions.currency}</span>
            </div>
          </Button>
        )}
        <Button 
          variant="link" 
          className="text-sm" 
          onClick={() => window.open(`https://explorer.solana.com/address/${blink.wallet}`, '_blank', 'noopener,noreferrer')}
        >
          View on Solana Explorer
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

