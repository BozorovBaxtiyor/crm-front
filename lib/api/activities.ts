import { fetchWithAuth } from '../api';

export interface Activity {
  id: number;
  type: 'call' | 'email' | 'meeting' | 'deal';
  description: string;
  customerId: number;
  customer?: {
    id: number;
    name: string;
  };
  createdAt: string;
}

export interface ActivitiesResponse {
  activities: Activity[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

// Barcha faoliyatlarni olish
export async function getActivities(params?: {
  page?: number;
  limit?: number;
  type?: 'call' | 'email' | 'meeting' | 'deal';
  customerId?: number;
}) {
  // Query parametrlarini tuzish
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.type) queryParams.append('type', params.type);
  if (params?.customerId) queryParams.append('customerId', params.customerId.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/activities?${queryString}` : '/activities';

  return fetchWithAuth(endpoint);
}

// Yangi faoliyat yaratish
export async function createActivity(activityData: {
  type: 'call' | 'email' | 'meeting' | 'deal';
  description: string;
  customerId: number;
}) {
  return fetchWithAuth('/activities', {
    method: 'POST',
    body: JSON.stringify(activityData),
  });
}
