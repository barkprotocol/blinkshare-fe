import { Syne, Poppins } from 'next/font/google'
import { Metadata } from 'next'
import { ClientWrapper } from '@/components/ui/client-wrapper'
import { Header } from "@/components/ui/layout/header"
import Footer from "@/components/ui/layout/footer"
import "./styles/globals.css"

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" })
const poppins = Poppins({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: 'BlinkShare | Community Experience Redefined',
  description: 'Enhance your community experience with BlinkShare\'s robust tools for payments, analytics, and management.',
  openGraph: {
    title: 'BlinkShare | Community Tools',
    description: 'Seamless Solana-based transactions, insightful analytics, and role management for your community.',
    images: ['/assets/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bark_protocol',
  },
  icons: {
    icon: '/favicon.ico',
  },
  alternates: {
    canonical: 'https://blinkshare.fun',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col min-h-screen">
        <ClientWrapper>
          <Header />
          <main className="flex-grow w-full px-0 md:px-0 lg:px-0 py-0">{children}</main>
          <Footer />
        </ClientWrapper>
      </body>
    </html>
  )
}

