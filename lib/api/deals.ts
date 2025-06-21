import { fetchWithAuth } from '../api';

export interface Deal {
    id: number;
    title: string;
    description: string;
    value: number;
    status: 'new' | 'in_progress' | 'completed' | 'cancelled';
    customerId: number;
    customer?: {
        id: number;
        name: string;
        company: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

export interface DealsResponse {
    deals: Deal[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
    };
}

// Get all deals with optional filtering
export async function getDeals(params?: {
    page?: number;
    limit?: number;
    status?: string;
    customerId?: number;
}) {
    // Build query string
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.customerId) queryParams.append('customerId', params.customerId.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/deals?${queryString}` : '/deals';

    return fetchWithAuth(endpoint);
}

// Create a new deal
export async function createDeal(dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) {
    return fetchWithAuth('/deals', {
        method: 'POST',
        body: JSON.stringify(dealData),
    });
}

// Update an existing deal
export async function updateDeal(
    id: number,
    dealData: Partial<Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>>,
) {
    return fetchWithAuth(`/deals/${id}`, {
        method: 'PUT',
        body: JSON.stringify(dealData),
    });
}

// Delete a deal
export async function deleteDeal(id: number) {
    return fetchWithAuth(`/deals/${id}`, {
        method: 'DELETE',
    });
}
