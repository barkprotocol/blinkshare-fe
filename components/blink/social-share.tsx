import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { BlinkData } from "@/types/blink"
import { Twitter, Send, Share2, Check } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface SocialShareProps {
  blinkId: string
}

export function SocialShare({ blinkId }: SocialShareProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()
  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/b/${blinkId}`
  const shareText = `Check out my new Blink!`

  const handleShare = async (platform: 'twitter' | 'telegram' | 'discord') => {
    let url = ''
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'telegram':
        url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
        break
      case 'discord':
        try {
          await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
          setIsCopied(true)
          toast({
            title: "Copied to clipboard",
            description: "You can now paste the link in Discord.",
          })
          setTimeout(() => setIsCopied(false), 3000)
          return
        } catch (err) {
          console.error('Failed to copy text: ', err)
          toast({
            title: "Failed to copy",
            description: "Please try again or copy the link manually.",
            variant: "destructive",
          })
        }
        break
    }
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-xl font-semibold">Share your Blink</h3>
      <Button onClick={() => handleShare('twitter')} className="flex items-center justify-center">
        <Twitter className="mr-2 h-4 w-4" /> Share on Twitter
      </Button>
      <Button onClick={() => handleShare('telegram')} className="flex items-center justify-center">
        <Send className="mr-2 h-4 w-4" /> Share on Telegram
      </Button>
      <Button 
        onClick={() => handleShare('discord')} 
        className="flex items-center justify-center"
        disabled={isCopied}
      >
        {isCopied ? (
          <>
            <Check className="mr-2 h-4 w-4" /> Copied!
          </>
        ) : (
          <>
            <Share2 className="mr-2 h-4 w-4" /> Copy for Discord
          </>
        )}
      </Button>
    </div>
  )
}

