import { useRef, useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BlinkData, BlinkType, ButtonType, Currency, currencyIcons } from "@/types/blink"
import { useWallet } from "@solana/wallet-adapter-react"

interface BlinkFormProps {
  blinkData: BlinkData
  onBlinkDataChange: (newData: Partial<BlinkData>) => void
  onGenerate: (blinkLink: string) => void
  connected: boolean
}

const blinkTypes: BlinkType[] = ['NFT', 'Gift', 'Payment']
const fontOptions = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat']
const buttonTypes: ButtonType[] = ['none', 'payment', 'donation']
const currencies: Currency[] = ['SOL', 'USDC', 'BARK']

export function BlinkForm({ blinkData, onBlinkDataChange, onGenerate, connected }: BlinkFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const backgroundInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { publicKey } = useWallet()

  const handleInputChange = (key: keyof BlinkData, value: string | boolean) => {
    onBlinkDataChange({ [key]: value })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, key: 'icon' | 'backgroundImage') => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onBlinkDataChange({ [key]: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleButtonOptionChange = (key: keyof BlinkData['buttonOptions'], value: string) => {
    onBlinkDataChange({
      buttonOptions: {
        ...blinkData.buttonOptions,
        [key]: value,
      },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected || !publicKey) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label: blinkData.label,
          description: blinkData.description,
          wallet: publicKey.toString(),
          mint: blinkData.buttonOptions.currency,
          commission: blinkData.buttonOptions.amount,
          percentage: false, // You might want to add this as an option in the form
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create Blink')
      }

      const data = await response.json()
      onGenerate(data.blinkLink)
    } catch (error) {
      console.error('Error creating Blink:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="icon">Icon</Label>
          <Input
            id="icon"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'icon')}
            ref={fileInputRef}
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select onValueChange={(value) => handleInputChange('type', value as BlinkType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {blinkTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={blinkData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter title"
          required
        />
      </div>
      <div>
        <Label htmlFor="titleDescription">Title Description</Label>
        <Input
          id="titleDescription"
          value={blinkData.titleDescription}
          onChange={(e) => handleInputChange('titleDescription', e.target.value)}
          placeholder="Enter a short description for your title"
        />
      </div>
      <div>
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={blinkData.label}
          onChange={(e) => handleInputChange('label', e.target.value)}
          placeholder="Enter label"
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={blinkData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter description"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="font">Font</Label>
          <Select onValueChange={(value) => handleInputChange('font', value)}>
            <SelectTrigger>
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
          <Label htmlFor="backgroundImage">Background Image</Label>
          <Input
            id="backgroundImage"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'backgroundImage')}
            ref={backgroundInputRef}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="backgroundColor">Background Color</Label>
          <Input
            id="backgroundColor"
            type="color"
            value={blinkData.backgroundColor}
            onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
            className="h-10 w-full"
          />
        </div>
        <div>
          <Label htmlFor="fontColor">Font Color</Label>
          <Input
            id="fontColor"
            type="color"
            value={blinkData.fontColor}
            onChange={(e) => handleInputChange('fontColor', e.target.value)}
            className="h-10 w-full"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="buttonType">Button Type</Label>
        <Select onValueChange={(value) => handleButtonOptionChange('type', value as ButtonType)}>
          <SelectTrigger>
            <SelectValue placeholder="Select button type" />
          </SelectTrigger>
          <SelectContent>
            {buttonTypes.map((type) => (
              <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {blinkData.buttonOptions.type !== 'none' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={blinkData.buttonOptions.amount}
              onChange={(e) => handleButtonOptionChange('amount', e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select onValueChange={(value) => handleButtonOptionChange('currency', value as Currency)}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    <div className="flex items-center">
                      <Image src={currencyIcons[currency] || "/placeholder.svg"} alt={currency} width={24} height={24} className="mr-2" />
                      {currency}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      {blinkData.buttonOptions.type !== 'none' && (
        <div>
          <Label htmlFor="address">Recipient Address</Label>
          <Input
            id="address"
            value={blinkData.buttonOptions.address}
            onChange={(e) => handleButtonOptionChange('address', e.target.value)}
            placeholder="Enter recipient address"
          />
        </div>
      )}
      <Button type="submit" className="w-full" disabled={!connected || isLoading}>
        {isLoading ? 'Creating Blink...' : 'Create Blink'}
      </Button>
    </form>
  )
}

