'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Plus, Sparkles } from 'lucide-react'

interface AddBlinkCardProps {
  onAdd: () => void
}

export function AddBlinkCard({ onAdd }: AddBlinkCardProps) {
  return (
    <Card 
      onClick={onAdd}
      className="glass-card flex items-center justify-center cursor-pointer border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 min-h-[200px] group"
    >
      <CardContent className="flex flex-col items-center py-8 text-center">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
          <Plus className="h-7 w-7 text-primary" />
        </div>
        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
          Create New Blink
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Start building something amazing
        </p>
        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          <span>Quick and easy</span>
        </div>
      </CardContent>
    </Card>
  )
}
