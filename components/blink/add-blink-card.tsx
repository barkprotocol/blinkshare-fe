import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import Link from 'next/link'

interface AddBlinkCardProps {
  onAdd: () => void
}

export function AddBlinkCard({ onAdd }: AddBlinkCardProps) {
  return (
    <Card className="flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="flex flex-col items-center py-6">
        <Button asChild variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
          <Link href="/blinks">
            <Plus className="h-6 w-6" />
            <span className="sr-only">Add a new Blink</span>
          </Link>
        </Button>
        <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">Add a new Blink</p>
      </CardContent>
    </Card>
  )
}

