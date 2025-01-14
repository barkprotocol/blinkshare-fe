'use client'

import React, { useEffect, useState } from 'react'
import { ThemeProvider } from "next-themes"
import { WalletProvider } from "@/components/ui/wallet-provider"
import { useRouter } from 'next/navigation'
import { toast } from "sonner"

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
  const router = useRouter()

  const [isPrivyAppIdMissing, setPrivyAppIdMissing] = useState(false)

  useEffect(() => {
    if (!privyAppId) {
      console.error("Privy app ID is missing. Please set NEXT_PUBLIC_PRIVY_APP_ID in your environment variables.")
      toast.error("Configuration error. Please contact support.")
      setPrivyAppIdMissing(true)
      router.push('https://doc.blinkshare.fun/support')
    }
  }, [privyAppId, router])

  if (isPrivyAppIdMissing) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <div>Redirecting to support...</div>
      </div>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <WalletProvider>
        {children}
      </WalletProvider>
    </ThemeProvider>
  )
}

