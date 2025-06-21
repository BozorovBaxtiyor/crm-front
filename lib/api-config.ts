export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

export const getImageUrl = ( imagePath : string) => {
  if (!imagePath) return '';
  const cleanedPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return `${API_BASE_URL}/${cleanedPath}`;
}

export const getApiUrl = (endpoint: string) => {
  if (!endpoint.startsWith("/")) {
    endpoint = `/${endpoint}`;
  }
  return `${API_BASE_URL}${endpoint}`;
}


