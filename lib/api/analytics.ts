import { fetchWithAuth } from "../api"

// Dashboard analitikalarini olish
export async function getDashboardAnalytics() {
  return fetchWithAuth("/analytics/dashboard")
}

// Sotuvlar analitikasini olish
export async function getSalesAnalytics(params?: {
  period?: "daily" | "weekly" | "monthly" | "yearly"
  startDate?: string
  endDate?: string
}) {
  // Query parametrlarini yaratish
  const queryParams = new URLSearchParams()
  
  if (params?.period) queryParams.append('period', params.period)
  if (params?.startDate) queryParams.append('startDate', params.startDate)
  if (params?.endDate) queryParams.append('endDate', params.endDate)
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/analytics/sales?${queryString}` : '/analytics/sales'
  
  return fetchWithAuth(endpoint)
}

export async function getSalesTrend(params?: {
  period?: "daily" | "weekly" | "monthly" | "yearly"
  startDate?: string
  endDate?: string
}) {
  // Query parametrlarini yaratish
  const queryParams = new URLSearchParams()
  
  if (params?.period) queryParams.append('period', params.period)
  if (params?.startDate) queryParams.append('startDate', params.startDate)
  if (params?.endDate) queryParams.append('endDate', params.endDate)
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/analytics/period?${queryString}` : '/analytics/period'
  
  return fetchWithAuth(endpoint)
}