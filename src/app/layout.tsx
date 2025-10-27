import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { Navbar } from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HorseGPT - ChatGPT for Horses',
  description: 'Ask anything about horses. Get instant AI-powered answers about barrel racing, horse breeding, training, health, and more. ChatGPT for horses.',
  keywords: 'horse AI, ChatGPT horses, barrel racing AI, horse breeding, equine AI, horse training',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-16">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
