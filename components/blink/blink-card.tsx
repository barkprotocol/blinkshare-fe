import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Check, Copy, Twitter } from 'lucide-react'

interface BlinkCardProps {
  blink: {
    _id: string
    title: string
    description: string
    privateKey: boolean
    mint: boolean
  }
}

export function BlinkCard({ blink }: BlinkCardProps) {
  const [copied, setCopied] = useState(false)
  const blinkLink = `https://dial.to/${blink.privateKey ? 'devnet' : ''}?action=solana-action:${blink._id}`

  const handleCopy = () => {
    navigator.clipboard.writeText(blinkLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTweet = () => {
    const tweetText = `Check out this Blink I just made @blinksharedotfun: ${blinkLink}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{blink.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">{blink.description || "No description provided."}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "Copied!" : "Copy link"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="outline" size="icon" onClick={handleTweet}>
          <Twitter className="h-4 w-4" />
        </Button>
        <Button asChild>
          <a href={blinkLink} target="_blank" rel="noopener noreferrer">
            {blink.mint ? "Tokens" : blink.privateKey ? "NFT" : "Donate"}
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

