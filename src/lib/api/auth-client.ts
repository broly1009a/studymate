import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ForgotPasswordData,
  ResetPasswordData,
} from '@/types/auth';

const API_BASE = '/api/auth';

/**
 * Login user
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
}

/**
 * Register user
 */
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  return response.json();
}

/**
 * Get current user
 */
export async function getCurrentUser(token: string) {
  const response = await fetch(`${API_BASE}/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user');
  }

  return response.json();
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<void> {
  const response = await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Logout failed');
  }
}

/**
 * Verify email
 */
export async function verifyEmail(token: string): Promise<void> {
  const response = await fetch(`${API_BASE}/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Email verification failed');
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(data: ForgotPasswordData): Promise<{ resetToken?: string }> {
  const response = await fetch(`${API_BASE}/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to request password reset');
  }

  return response.json();
}

/**
 * Reset password
 */
export async function resetPassword(data: ResetPasswordData & { token: string }): Promise<void> {
  const response = await fetch(`${API_BASE}/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Password reset failed');
  }
}
