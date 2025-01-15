import { BlinkType, ButtonType, Currency } from "@/app/types/blink"

export interface Blink {
  id: string
  title: string
  description: string
  icon: string
  label: string
  type: BlinkType
  font: string
  backgroundColor: string
  fontColor: string
  backgroundImage: string | null
  buttonOptions: {
    type: ButtonType
    amount: string
    currency: Currency
  }
  wallet: string
  mint?: string
  created_at: string
  privateKey: boolean
}

export const sampleBlinks: Blink[] = [
  {
    id: "1",
    title: "Welcome to BlinkShare",
    description: "This is a sample Blink to showcase the platform's capabilities.",
    icon: "https://ucarecdn.com/b60a22da-6905-4228-8b18-6967e01ce462/barkicontransparent.webp",
    label: "Sample Blink",
    type: "NFT",
    font: "Inter",
    backgroundColor: "#ffffff",
    fontColor: "#000000",
    backgroundImage: null,
    buttonOptions: {
      type: "payment",
      amount: "0.1",
      currency: "SOL"
    },
    wallet: "BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo",
    mint: "SampleMintAddress111111111111111111111111111111",
    created_at: new Date().toISOString(),
    privateKey: false
  },
  {
    id: "2",
    title: "Donate to Our Cause",
    description: "Support our mission by donating. Every bit helps!",
    icon: "https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp",
    label: "Donation Blink",
    type: "Gift",
    font: "Roboto",
    backgroundColor: "#f3f4f6",
    fontColor: "#1f2937",
    backgroundImage: "https://ucarecdn.com/92d4d7ea-f9d8-429c-bf68-6f3bc69c1c02/goldenshoppingcart.jpg",
    buttonOptions: {
      type: "donation",
      amount: "5",
      currency: "USDC"
    },
    wallet: "BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo",
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    privateKey: true
  },
  {
    id: "3",
    title: "Limited Edition NFT",
    description: "Get your hands on this exclusive NFT! Only 100 available.",
    icon: "https://ucarecdn.com/b60a22da-6905-4228-8b18-6967e01ce462/barkicontransparent.webp",
    label: "Exclusive NFT",
    type: "NFT",
    font: "Poppins",
    backgroundColor: "#1e1e1e",
    fontColor: "#ffffff",
    backgroundImage: null,
    buttonOptions: {
      type: "payment",
      amount: "1",
      currency: "BARK"
    },
    wallet: "BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo",
    mint: "ExclusiveNFTMintAddress1111111111111111111111",
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    privateKey: false
  }
]

