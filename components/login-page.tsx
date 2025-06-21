"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Mail, Lock } from "lucide-react"

import { useLanguage } from "@/contexts/language-context"
import { ThemeLanguageSwitcher } from "@/components/theme-language-switcher"
import { getApiUrl } from "@/lib/api-config"

interface LoginPageProps {
  onLogin: (userData: any) => boolean
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const { t } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const apiUrl = getApiUrl("/auth/login")
      console.log("API URL:", apiUrl);
      const response = await fetch(`${apiUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      
      console.log("Login response:", response);

      const data = await response.json()

      console.log("Login response:", data);
      
      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || t("login.error"))
      }

      // Save token to local storage for future requests
      localStorage.setItem('authToken', data.data.token)
      localStorage.setItem('refreshToken', data.data.refreshToken)
      
      // Call the onLogin callback with user data
      onLogin(data.data) 
    } catch (error) {
      setError((error as Error).message || t("login.error"))
      console.error("Login error:", error)
    }finally {
      setIsLoading(false)
    }
    // Simulate loading
    // await new Promise((resolve) => setTimeout(resolve, 1000))

    // const success = onLogin(email, password)
    // if (!success) {
    //   setError(t("login.error"))
    // }
    // setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeLanguageSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">{t("login.title")}</CardTitle>
          <CardDescription>{t("login.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("login.email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("login.password")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="StrongPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("login.loading") : t("login.button")}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-2">{t("login.demo")}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Email: example@gmail.com</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("login.password")}: StrongPassword</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
