/**
 * Client-side API helper functions for users endpoints
 * Wraps fetch calls with proper error handling and token management
 */

import { API_URL } from '@/lib/constants';

/**
 * Get user profile by ID
 * GET /api/users/[id]
 */
export async function getUserProfile(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to fetch user profile: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Get user activities by ID with pagination
 * GET /api/users/[id]/activities?page=1&limit=10
 */
export async function getUserActivities(userId: string, page = 1, limit = 10) {
  try {
    const url = new URL(`/api/users/${userId}/activities`, window.location.origin);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to fetch user activities: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user activities:', error);
    throw error;
  }
}

/**
 * Get user statistics by ID
 * GET /api/users/[id]/stats
 */
export async function getUserStats(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to fetch user stats: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
}
