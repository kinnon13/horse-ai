import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/AuthProvider'
import { ConditionalNavbar } from '@/components/ConditionalNavbar'
import { ThemeProvider } from '@/ui/ThemeProvider'
import { Toaster } from '@/ui/components/Toaster'
import { inter } from '@/ui/theme'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: 'HorseGPT - ChatGPT for Horses',
  description:
    'Ask anything about horses. Get instant AI-powered answers about barrel racing, horse breeding, training, health, and more. ChatGPT for horses.',
  keywords:
    'horse AI, ChatGPT horses, barrel racing AI, horse breeding, equine AI, horse training',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.className} ${inter.variable}`}>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 transition-colors duration-500 dark:bg-neutral-900 dark:text-neutral-50">
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen">
              <ConditionalNavbar />
              <main>{children}</main>
            </div>
          </AuthProvider>
          <Toaster />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
