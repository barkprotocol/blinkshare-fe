import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Lock, Coins } from 'lucide-react'

interface Blink {
  id: string
  title: string
  description: string
  privateKey: boolean
  mint: boolean
}

interface BlinkCardProps {
  blink: Blink
}

export function BlinkCard({ blink }: BlinkCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{blink.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2">
          {blink.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {blink.privateKey ? (
              <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            )}
            <span className="text-sm text-muted-foreground">
              {blink.privateKey ? 'Private' : 'Public'}
            </span>
          </div>
          {blink.mint && (
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">Mintable</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/blinks/${blink.id}`} passHref legacyBehavior>
          <Button variant="default" className="w-full" asChild>
            <a>View Blink</a>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

