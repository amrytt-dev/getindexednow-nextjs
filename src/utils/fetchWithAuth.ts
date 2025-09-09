// Dynamic import for authService to avoid mixed import warnings
let authServiceModule: any = null;

const loadAuthService = async () => {
  if (!authServiceModule) {
    authServiceModule = await import("./authService");
  }
  return authServiceModule;
};

interface FetchWithAuthOptions extends RequestInit {
  requireAuth?: boolean;
  redirectOnUnauthorized?: boolean;
  skipTokenValidation?: boolean;
}

interface ApiError extends Error {
  status?: number;
  statusText?: string;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Centralized fetch utility with automatic authentication handling
 * @param endpoint - API endpoint (without base URL)
 * @param options - Fetch options with additional auth-specific options
 * @returns Promise with parsed JSON response
 */
export async function fetchWithAuth<T = any>(
  endpoint: string,
  options: FetchWithAuthOptions = {}
): Promise<T> {
  const {
    requireAuth = true,
    redirectOnUnauthorized = true,
    skipTokenValidation = false,
    headers = {},
    ...fetchOptions
  } = options;

  // Get token from auth service
  const { getAuthHeader } = await import("./authToken");
  const authHeader = await getAuthHeader();

  // Validate token if required and not skipped
  // Skipping client-side token expiry checks to let Firebase/Backend validate

  // Prepare headers
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  // Add authorization header if required and token exists
  if (requireAuth && authHeader.Authorization) {
    requestHeaders["Authorization"] = authHeader.Authorization;
  }

  // Remove Content-Type if body is FormData
  if (fetchOptions.body instanceof FormData) {
    delete requestHeaders["Content-Type"];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      ...fetchOptions,
      headers: requestHeaders,
    });

    // Handle 401 Unauthorized responses
    if (response.status === 401) {
      if (redirectOnUnauthorized) {
        throw new ApiError(
          "Unauthorized - Redirecting to login",
          401,
          "Unauthorized"
        );
      } else {
        throw new ApiError("Unauthorized", 401, "Unauthorized");
      }
    }

    // Handle other error responses
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If error response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }

      throw new ApiError(errorMessage, response.status, response.statusText);
    }

    // Parse JSON response
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    // Return text if not JSON
    return (await response.text()) as T;
  } catch (error) {
    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error;
    }

    // Wrap other errors
    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
      0,
      "Network Error"
    );
  }
}

/**
 * GET request with authentication
 */
export async function getWithAuth<T = any>(
  endpoint: string,
  options: Omit<FetchWithAuthOptions, "method"> = {}
): Promise<T> {
  return fetchWithAuth<T>(endpoint, { ...options, method: "GET" });
}

/**
 * POST request with authentication
 */
export async function postWithAuth<T = any>(
  endpoint: string,
  data?: any,
  options: Omit<FetchWithAuthOptions, "method" | "body"> = {}
): Promise<T> {
  return fetchWithAuth<T>(endpoint, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PUT request with authentication
 */
export async function putWithAuth<T = any>(
  endpoint: string,
  data?: any,
  options: Omit<FetchWithAuthOptions, "method" | "body"> = {}
): Promise<T> {
  return fetchWithAuth<T>(endpoint, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH request with authentication
 */
export async function patchWithAuth<T = any>(
  endpoint: string,
  data?: any,
  options: Omit<FetchWithAuthOptions, "method" | "body"> = {}
): Promise<T> {
  return fetchWithAuth<T>(endpoint, {
    ...options,
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * DELETE request with authentication
 */
export async function deleteWithAuth<T = any>(
  endpoint: string,
  options: Omit<FetchWithAuthOptions, "method"> = {}
): Promise<T> {
  return fetchWithAuth<T>(endpoint, { ...options, method: "DELETE" });
}

/**
 * Specialized function for downloading files (returns Response object)
 * @param endpoint - API endpoint (without base URL)
 * @param options - Fetch options
 * @returns Promise with Response object for file handling
 */
export async function downloadWithAuth(
  endpoint: string,
  options: Omit<FetchWithAuthOptions, "method"> = {}
): Promise<Response> {
  const {
    requireAuth = true,
    redirectOnUnauthorized = true,
    skipTokenValidation = false,
    headers = {},
    ...fetchOptions
  } = options;

  // Get token from auth service
  const { authService } = await loadAuthService();
  const token = await authService.getToken();

  // Validate token if required and not skipped
  if (requireAuth && token && !skipTokenValidation) {
    if (authService.isTokenExpired(token)) {
      authService.logout("Your session has expired. Please log in again.");
      throw new ApiError("Token expired", 401, "Unauthorized");
    }
  }

  // Prepare headers
  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  // Add authorization header if required and token exists
  if (requireAuth && token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    ...fetchOptions,
    headers: requestHeaders,
  });

  // Handle 401 Unauthorized responses
  if (response.status === 401) {
    if (redirectOnUnauthorized) {
      // Use auth service to handle logout
      const { authService } = await loadAuthService();
      authService.logout("Your session is invalid. Please log in again.");
      throw new ApiError(
        "Unauthorized - Redirecting to login",
        401,
        "Unauthorized"
      );
    } else {
      throw new ApiError("Unauthorized", 401, "Unauthorized");
    }
  }

  // Handle other error responses
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // If error response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiError(errorMessage, response.status, response.statusText);
  }

  return response;
}

export const getTaskCounter = async (
  type: "indexer" | "checker"
): Promise<{ counter: number; type: string }> => {
  const response = await postWithAuth("/proxy/speedyindex/counter", { type });
  return response;
};

// Email change API functions
export const emailChangeApi = {
  // Validate email availability
  validateEmail: async (email: string): Promise<any> => {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/user/email/validate?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to validate email");
    }

    return response.json();
  },

  // Initiate email change request
  initiateChange: async (newEmail: string): Promise<any> => {
    const response = await postWithAuth("/user/email/initiate-change", {
      newEmail,
    });
    return response;
  },

  // Verify email change with 2FA
  verifyWith2FA: async (twoFactorToken: string): Promise<any> => {
    const response = await postWithAuth("/user/email/verify-2fa", {
      twoFactorToken,
    });
    return response;
  },

  // Get email change status
  getStatus: async (): Promise<any> => {
    const response = await getWithAuth("/user/email/change-status");
    return response;
  },

  // Cancel email change request
  cancelChange: async (): Promise<any> => {
    const response = await postWithAuth("/user/email/cancel-change", {});
    return response;
  },
};

export { ApiError };
