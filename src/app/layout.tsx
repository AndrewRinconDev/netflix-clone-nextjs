import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MainNav from '@/components/navigation/MainNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Netflix Clone',
  description: 'A Netflix clone built with Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <MainNav />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  )
}