import { fetchWithAuth } from "../api"

// Dashboard analitikalarini olish
export async function getDashboardAnalytics() {
  return fetchWithAuth("/analytics/dashboard")
}

// Sotuvlar analitikasini olish
export async function getSalesAnalytics(params?: {
  startDate?: string
  endDate?: string
  period?: "daily" | "weekly" | "monthly" | "yearly"
}) {
  // Query parametrlarini yaratish
  const queryParams = new URLSearchParams()
  
  if (params?.startDate) queryParams.append('startDate', params.startDate)
  if (params?.endDate) queryParams.append('endDate', params.endDate)
  if (params?.period) queryParams.append('period', params.period)
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/analytics/sales?${queryString}` : '/analytics/sales'
  
  return fetchWithAuth(endpoint)
}