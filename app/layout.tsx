"use client"

import type React from "react"
import { useState, useEffect } from "react"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { ThemeProvider } from "@/components/theme-provider"
import { useAuth } from '@/hooks/use-auth'

// Static metadata is not supported in Client Components, so we remove it
// Static metadata should be in a separate Server Component

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { isLoading, checkAndRefreshToken } = useAuth()
  const [isAuthChecking, setIsAuthChecking] = useState(true)
  
  useEffect(() => {
    // Ilova ishga tushganida tokenni tekshirish
    const checkAuth = async () => {
      await checkAndRefreshToken()
      setIsAuthChecking(false)
    }
    
    checkAuth()
  }, [checkAndRefreshToken])
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true} disableTransitionOnChange={false}>
          <LanguageProvider>
            {isAuthChecking ? (
              <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              children
            )}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}