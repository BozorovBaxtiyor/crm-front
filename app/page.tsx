"use client"

import { useState, useEffect } from "react"
import LoginPage from "@/components/login-page"
import CRMDashboard from "@/components/crm-dashboard"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)

  // Check if user is already logged in on page load
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      // Optionally validate the token here
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (userData: any): boolean => {
    setUserData(userData)
    setIsLoggedIn(true)
    return true
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    setIsLoggedIn(false)
    setUserData(null)
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <CRMDashboard onLogout={handleLogout} />
}