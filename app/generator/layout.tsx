import React from 'react'
import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export const metadata: Metadata = {
  title: 'Blink Generator | Create Your Custom Blink',
  description: 'Create and customize your own Blink for donations, payments, gifts, or minting NFTs and tokens.',
}

export default function GeneratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8 sm:py-40">
        <Card className="max-w-6xl mx-auto">
          <CardHeader className="space-y-2">
            <CardTitle asChild>
              <h1 className="text-3xl sm:text-4xl font-bold text-center">
                Blink Generator
              </h1>
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-center">
              Create your custom Blink for donations, payments, gifts, or minting NFTs and tokens.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

