'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Eye, 
  Lock, 
  Coins, 
  ExternalLink, 
  MoreVertical, 
  Trash2, 
  Settings,
  Copy,
  Share2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'

interface Blink {
  id: string
  title: string
  description: string
  privateKey?: boolean
  mint?: boolean
  icon?: string
  views?: number
  clicks?: number
}

interface BlinkCardProps {
  blink: Blink
  onDelete?: () => void
  onEdit?: () => void
}

export function BlinkCard({ blink, onDelete, onEdit }: BlinkCardProps) {
  const handleCopyLink = () => {
    const link = `${window.location.origin}/blinks/${blink.id}`
    navigator.clipboard.writeText(link)
    toast.success('Link copied to clipboard')
  }

  const handleShare = async () => {
    const link = `${window.location.origin}/blinks/${blink.id}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: blink.title,
          text: blink.description,
          url: link,
        })
      } catch (err) {
        handleCopyLink()
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <Card className="glass-card flex flex-col h-full group hover:border-primary/50 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
              {blink.title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {blink.description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              {onEdit && (
                <DropdownMenuItem onClick={onEdit}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={blink.privateKey ? "secondary" : "outline"} className="text-xs">
            {blink.privateKey ? (
              <><Lock className="h-3 w-3 mr-1" /> Private</>
            ) : (
              <><Eye className="h-3 w-3 mr-1" /> Public</>
            )}
          </Badge>
          {blink.mint && (
            <Badge variant="outline" className="text-xs">
              <Coins className="h-3 w-3 mr-1" /> Mintable
            </Badge>
          )}
        </div>
        
        {/* Stats */}
        {(blink.views !== undefined || blink.clicks !== undefined) && (
          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
            {blink.views !== undefined && (
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {blink.views.toLocaleString()} views
              </span>
            )}
            {blink.clicks !== undefined && (
              <span className="flex items-center gap-1">
                <ExternalLink className="h-3.5 w-3.5" />
                {blink.clicks.toLocaleString()} clicks
              </span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild className="w-full" variant="default">
          <Link href={`/blinks/${blink.id}`}>
            View Blink
            <ExternalLink className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
