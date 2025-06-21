export function isTokenExpired(token: string): boolean {
  if (!token) return true
  
  try {
    // JWT ning payload qismini olish (ikkinchi qism)
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(window.atob(base64))
    
    // Token muddatini tekshirish
    const currentTime = Date.now() / 1000
    return payload.exp < currentTime
  } catch (e) {
    return true
  }
}