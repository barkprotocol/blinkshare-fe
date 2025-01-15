'use client'

import { useState, useCallback, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useWallet } from "@solana/wallet-adapter-react"
import { Card, CardContent } from "@/components/ui/card"
import { Form } from "@/components/blink/form"
import { BlinkPreview } from "@/components/blink/blink-preview"
import { BlinkData, BlinkType, ButtonType, Currency } from "@/app/types/blink"
import { SocialShare } from "@/components/blink/social-share"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { InfoCard } from "@/components/blink/info-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ColorPicker } from "@/components/ui/color-picker"

const defaultBlinkData: Partial<BlinkData> = {
  icon: '',
  label: 'Your Label',
  description: 'Your Description shows up here. Keep it short and simple',
  title: 'Your Title :)',
  titleDescription: 'A short description of your title',
  type: 'NFT',
  font: 'Inter',
  backgroundColor: '#ffffff',
  fontColor: '#000000',
  cardBackgroundColor: '#f3f4f6',
  backgroundImage: null,
  buttonOptions: {
    type: 'none',
    amount: '',
    currency: 'SOL',
  },
}

const fontOptions = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Oswald', 'Raleway', 'Ubuntu'
]

export default function BlinkGeneratorPage() {
  const [blinkData, setBlinkData] = useState<Partial<BlinkData>>(defaultBlinkData)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBlinkId, setGeneratedBlinkId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const { publicKey, connected } = useWallet()
  const router = useRouter()
  const { toast } = useToast()

  const handleBlinkDataChange = useCallback((newData: Partial<BlinkData>) => {
    setBlinkData(prevData => ({ ...prevData, ...newData }))
  }, [])

  const handleGenerate = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a Blink.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const blinkToGenerate: Partial<BlinkData> = {
        ...blinkData,
        wallet: publicKey.toString(),
        created_at: new Date().toISOString(),
      }

      const response = await fetch('/api/actions/generate-blink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blinkToGenerate),
      })

      if (!response.ok) {
        throw new Error('Failed to create Blink')
      }

      const data = await response.json()
      toast({
        title: "Blink created",
        description: "Your Blink has been successfully created.",
      })
      setGeneratedBlinkId(data.blinkId)
      setActiveTab('preview')
    } catch (error) {
      console.error('Error creating Blink:', error)
      toast({
        title: "Error",
        description: "Failed to create Blink. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = useCallback(() => {
    setBlinkData(defaultBlinkData)
    setGeneratedBlinkId(null)
    setActiveTab('edit')
    toast({
      title: "Reset",
      description: "Blink data has been reset.",
    })
  }, [toast])

  const handleSendSolanaBlink = useCallback(async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to send a Solana Blink.",
        variant: "destructive",
      })
      return
    }

    // Implement Solana Blink sending logic here
    toast({
      title: "Sending Solana Blink",
      description: "This feature is not yet implemented.",
    })
  }, [connected, publicKey, toast])

  const handleRandomize = useCallback(() => {
    const randomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`
    const randomFont = fontOptions[Math.floor(Math.random() * fontOptions.length)]
    
    setBlinkData(prevData => ({
      ...prevData,
      backgroundColor: randomColor(),
      fontColor: randomColor(),
      cardBackgroundColor: randomColor(),
      font: randomFont,
    }))
  }, [])

  useEffect(() => {
    if (generatedBlinkId) {
      setActiveTab('preview')
    }
  }, [generatedBlinkId])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 text-center mb-2">Design Your Blink</h2>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-6">
          Customize your Blink for NFTs, gifts, or payments with our advanced generator
        </p>
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            onClick={() => router.push('/wallet')}
            variant="outline"
            className="bg-white dark:bg-gray-800 text-black dark:text-white border-2 border-black dark:border-white"
          >
            Wallet
          </Button>
          <Button 
            onClick={handleReset} 
            variant="outline" 
            className="bg-white dark:bg-gray-800 text-black dark:text-white border-2 border-black dark:border-white"
          >
            Reset
          </Button>
          <Button
            onClick={handleSendSolanaBlink}
            variant="outline"
            className="bg-white dark:bg-gray-800 text-black dark:text-white border-2 border-black dark:border-white"
          >
            Send Blink
          </Button>
          <Button
            onClick={handleRandomize}
            variant="outline"
            className="bg-white dark:bg-gray-800 text-black dark:text-white border-2 border-black dark:border-white"
          >
            Randomize
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <Form 
                  blinkData={blinkData} 
                  onBlinkDataChange={handleBlinkDataChange}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  connected={connected}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="font">Font</Label>
                    <Select
                      value={blinkData.font}
                      onValueChange={(value) => handleBlinkDataChange({ font: value })}
                    >
                      <SelectTrigger id="font">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((font) => (
                          <SelectItem key={font} value={font}>{font}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cardBackgroundColor">Card Background Color</Label>
                    <ColorPicker
                      color={blinkData.cardBackgroundColor || '#ffffff'}
                      onChange={(color) => handleBlinkDataChange({ cardBackgroundColor: color })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <ColorPicker
                      color={blinkData.backgroundColor || '#ffffff'}
                      onChange={(color) => handleBlinkDataChange({ backgroundColor: color })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fontColor">Font Color</Label>
                    <ColorPicker
                      color={blinkData.fontColor || '#000000'}
                      onChange={(color) => handleBlinkDataChange({ fontColor: color })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="backgroundOpacity">Background Opacity</Label>
                    <Slider
                      id="backgroundOpacity"
                      min={0}
                      max={100}
                      step={1}
                      value={[parseInt(blinkData.backgroundOpacity?.toString() || '100')]}
                      onValueChange={(value) => handleBlinkDataChange({ backgroundOpacity: value[0] })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="enableAnimation" className="flex items-center space-x-2">
                      <Switch
                        id="enableAnimation"
                        checked={blinkData.enableAnimation || false}
                        onCheckedChange={(checked) => handleBlinkDataChange({ enableAnimation: checked })}
                      />
                      <span>Enable Animation</span>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="preview">
            <Card className="bg-white dark:bg-gray-800" style={{ backgroundColor: blinkData.cardBackgroundColor }}>
              <CardContent className="p-6">
                <BlinkPreview {...blinkData} />
              </CardContent>
            </Card>
            {generatedBlinkId && (
              <Card className="bg-white dark:bg-gray-800 mt-8">
                <CardContent className="p-6">
                  <SocialShare blinkId={generatedBlinkId} />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        <Card className="bg-white dark:bg-gray-800 mt-8">
          <CardContent className="p-6">
            <InfoCard />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

