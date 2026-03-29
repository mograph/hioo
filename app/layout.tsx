import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/AuthContext'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'hioo — your digital wardrobe',
  description: 'Capture outfits, track what you wear, discover your style.',
  themeColor: '#FAFAFA',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'hioo',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="cork-bg min-h-screen antialiased">
        <AuthProvider>
          <Navigation />
          <main className="pt-12 md:pt-14">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
