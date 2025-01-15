export type BlinkType = 'NFT' | 'Gift' | 'Payment'
export type ButtonType = 'none' | 'payment' | 'donation'
export type Currency = 'SOL' | 'USDC' | 'BARK'

export interface BlinkData {
  id: string
  icon: string
  label: string
  description: string
  title: string
  titleDescription: string
  type: BlinkType
  font: string
  backgroundColor: string
  fontColor: string
  backgroundImage: string | null
  buttonOptions: {
    type: ButtonType
    amount: string
    currency: Currency
    address?: string
  }
  wallet: string
  mint?: string
  created_at: string
}

export const currencyIcons: Record<Currency, string> = {
  SOL: 'https://ucarecdn.com/0aa23f11-40b3-4cdc-891b-a169ed9f9328/sol.png',
  USDC: 'https://ucarecdn.com/ee18c01a-d01d-4ad6-adb6-cac9a5539d2c/usdc.png',
  BARK: 'https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp',
}

