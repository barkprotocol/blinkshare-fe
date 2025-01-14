import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'

interface AddBlinkCardProps {
  onAdd: () => void
}

export function AddBlinkCard({ onAdd }: AddBlinkCardProps) {
  return (
    <Card className="flex items-center justify-center cursor-pointer hover:bg-gray-50" onClick={onAdd}>
      <CardContent className="flex flex-col items-center py-6">
        <Plus className="h-12 w-12 text-gray-400 mb-2" />
        <p className="text-sm font-medium text-gray-600">Add a new Blink</p>
      </CardContent>
    </Card>
  )
}

