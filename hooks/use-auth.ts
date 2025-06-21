import { useState, useEffect, useCallback } from 'react'
import { refreshToken } from '@/lib/api'
import { isTokenExpired } from '@/utils/auth'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Tokenni tekshirish va kerak bo'lsa yangilash
  const checkAndRefreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken')
      const refreshTokenValue = localStorage.getItem('refreshToken')
      
      if (!token || !refreshTokenValue) {
        setIsAuthenticated(false)
        return false
      }
      
      // Token muddati tekshirish
      if (isTokenExpired(token)) {
        const authData = await refreshToken(refreshTokenValue)
        localStorage.setItem('authToken', authData.token)
        localStorage.setItem('refreshToken', authData.refreshToken)
      }
      
      setIsAuthenticated(true)
      return true
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      setIsAuthenticated(false)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  // Komponent mount bo'lganda tokenni tekshirish
  useEffect(() => {
    checkAndRefreshToken()
  }, [checkAndRefreshToken])
  
  // Har 10 daqiqada tokenni tekshirish va yangilash
  useEffect(() => {
    const intervalId = setInterval(() => {
      checkAndRefreshToken()
    }, 10 * 60 * 1000) // 10 minutes
    
    return () => clearInterval(intervalId)
  }, [checkAndRefreshToken])
  
  // Logout funksiyasi
  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    setIsAuthenticated(false)
  }, [])
  
  return { isAuthenticated, isLoading, checkAndRefreshToken, logout }
}