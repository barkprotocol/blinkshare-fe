import React, { useState, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Input } from './input'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [inputColor, setInputColor] = useState(color)

  useEffect(() => {
    setInputColor(color)
  }, [color])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setInputColor(newColor)
    if (newColor.match(/^#[0-9A-Fa-f]{6}$/)) {
      onChange(newColor)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="w-10 h-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ backgroundColor: color }}
            aria-label="Pick a color"
          />
        </PopoverTrigger>
        <PopoverContent className="p-0 border-none">
          <HexColorPicker color={color} onChange={onChange} />
        </PopoverContent>
      </Popover>
      <Input
        type="text"
        value={inputColor}
        onChange={handleInputChange}
        className="w-28"
        placeholder="#000000"
      />
    </div>
  )
}

