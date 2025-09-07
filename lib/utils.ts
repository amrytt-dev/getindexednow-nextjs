import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Global fetch wrapper that logs out and redirects to login on 401 Unauthorized.
 * Usage: Replace all fetch calls with apiFetch.
 */
export async function apiFetch(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, {
    ...init,
    credentials: 'include', // if you use cookies for auth
  });

  if (response.status === 401) {
    // Remove auth tokens if stored in localStorage/sessionStorage
    localStorage.removeItem('token');
    // Optionally, clear user context here if you use React Context

    // Redirect to login page
    window.location.href = '/login';
    // Optionally, throw or return a special value
    return;
  }

  return response;
}
