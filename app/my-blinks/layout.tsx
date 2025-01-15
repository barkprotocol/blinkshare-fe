import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Blinks',
}

export default function MyBlinksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
