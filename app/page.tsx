"use client"

import { useState } from "react"
import LoginPage from "@/components/login-page"
import CRMDashboard from "@/components/crm-dashboard"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = (email: string, password: string) => {
    // Simple authentication check
    if (email === "example@gmail.com" && password === "StrongPassword") {
      setIsLoggedIn(true)
      return true
    }
    return false
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <CRMDashboard onLogout={handleLogout} />
}
