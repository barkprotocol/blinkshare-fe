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
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank')
  }

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-gray-50 dark:bg-gray-800">
        <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">{blink.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">{blink.description || "No description provided."}</p>
      </CardContent>
      <CardFooter className="flex justify-between bg-gray-100 dark:bg-gray-700 p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleCopy} className="bg-white dark:bg-gray-800">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "Copied!" : "Copy link"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="outline" size="icon" onClick={handleTweet} className="bg-white dark:bg-gray-800">
          <Twitter className="h-4 w-4" />
        </Button>
        <Button asChild className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
          <a href={blinkLink} target="_blank" rel="noopener noreferrer">
            {blink.mint ? "Tokens" : blink.privateKey ? "Gamble" : "Donate"}
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

