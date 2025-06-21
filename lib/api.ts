import { getApiUrl } from "./api-config"


export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken')
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  let response = await fetch(`${getApiUrl(endpoint)}`, {
    ...options,
    headers,
  })

  // Token eskirgan bo'lsa, yangi token olish va so'rovni qayta yuborish
  if (response.status === 401) {
    try {
      const oldRefreshToken = localStorage.getItem('refreshToken')
      
      if (!oldRefreshToken) {
        throw new Error("No refresh token available")
      }
      
      // Refresh token orqali yangi token olish
      const authData = await refreshToken(oldRefreshToken)
      
      // Yangi tokenlarni saqlash
      localStorage.setItem('authToken', authData.token)
      localStorage.setItem('refreshToken', authData.refreshToken)
      
      // So'rovni yangi token bilan qayta yuborish
      headers.Authorization = `Bearer ${authData.token}`
      response = await fetch(`${getApiUrl(endpoint)}`, {
        ...options,
        headers,
      })
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError)
      // Token yangilash muvaffaqiyatsiz bo'lsa, foydalanuvchini chiqarib yuborish
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
      window.location.href = "/" // Yoki login sahifasiga yo'naltirish
      throw new Error("Authentication failed. Please login again.")
    }
  }

  const data = await response.json()
  
  if (!response.ok) {
    console.error("API Error:", data)
    throw new Error(data.error?.message || 'An error occurred')
  }

  return data
}



export async function refreshToken(refreshToken: string) {
  try {
    const response = await fetch(getApiUrl("/auth/refresh"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refreshToken })
    })

    if (!response.ok) {
      throw new Error("Failed to refresh token")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Token refresh failed:", error)
    throw error
  }
}
