'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { BlinkForm } from "@/components/blink-form"
import { BlinkPreview } from "@/components/blink-preview"
import { BlinkData } from "@/types/blink"
import { SocialShare } from "@/components/social-share"

const defaultBlinkData: BlinkData = {
  icon: '',
  label: 'Your Label',
  description: 'Your Description shows up here. Keep it short and simple',
  title: 'Your Title :)',
  titleDescription: 'A short description of your title',
  type: 'NFT',
  font: 'Inter',
  backgroundColor: '#ffffff',
  fontColor: '#000000',
  backgroundImage: null,
  buttonOptions: {
    type: 'none',
    amount: '',
    currency: 'SOL',
  },
}

export default function BlinkGeneratorPage() {
  const [blinkData, setBlinkData] = useState<BlinkData>(defaultBlinkData)
  const [isGenerated, setIsGenerated] = useState(false)

  const handleBlinkDataChange = (newData: Partial<BlinkData>) => {
    setBlinkData(prevData => ({ ...prevData, ...newData }))
  }

  const handleGenerate = () => {
    console.log('Blink generated:', blinkData)
    setIsGenerated(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-2">Blink Generator</h1>
        <p className="text-lg text-center text-gray-600 mb-12">Create your custom Blink for NFTs, gifts, or payments</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white">
            <CardContent className="p-6">
              <BlinkForm 
                blinkData={blinkData} 
                onBlinkDataChange={handleBlinkDataChange}
                onGenerate={handleGenerate}
              />
            </CardContent>
          </Card>
          <div className="space-y-8">
            <Card className="bg-white">
              <CardContent className="p-6">
                <BlinkPreview {...blinkData} />
              </CardContent>
            </Card>
            {isGenerated && (
              <Card className="bg-white">
                <CardContent className="p-6">
                  <SocialShare blinkData={blinkData} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

