import type { UserProfile } from '@/types/profile';

const API_BASE = '/api/profiles';

/**
 * Get current user's profile
 */
export async function getUserProfile(token: string): Promise<{ profile: UserProfile }> {
  const response = await fetch(`${API_BASE}/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch profile');
  }

  return response.json();
}

/**
 * Update current user's profile
 */
export async function updateUserProfile(
  token: string,
  data: Partial<UserProfile>
): Promise<{ message: string; profile: UserProfile }> {
  const response = await fetch(`${API_BASE}/me`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update profile');
  }

  return response.json();
}

/**
 * Get user's activities
 */
export async function getUserActivities(
  token: string,
  options?: { page?: number; limit?: number }
): Promise<{
  activities: any[];
  pagination: { page: number; limit: number; total: number };
}> {
  const params = new URLSearchParams();
  if (options?.page) params.set('page', options.page.toString());
  if (options?.limit) params.set('limit', options.limit.toString());

  const response = await fetch(`${API_BASE}/me/activities?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch activities');
  }

  return response.json();
}

/**
 * Get user's statistics
 */
export async function getUserStats(token: string): Promise<{ stats: Record<string, any> }> {
  const response = await fetch(`${API_BASE}/me/stats`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch stats');
  }

  return response.json();
}
