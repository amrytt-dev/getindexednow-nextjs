// Store the original fetch function
const originalFetch = window.fetch;

// Create a dedicated auth service loader to avoid mixed imports
let authServiceModule: any = null;

const loadAuthService = async () => {
  if (!authServiceModule) {
    authServiceModule = await import("./authService");
  }
  return authServiceModule;
};

// Create a custom fetch function that intercepts requests
const interceptedFetch = async (
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  // Clone the init object to avoid mutating the original
  const modifiedInit = { ...init };
  const modifiedHeaders = new Headers(init?.headers);

  // Check if this is an API request to our backend
  const url = typeof input === "string" ? input : input.url;
  const isApiRequest =
    url.includes(process.env.NEXT_PUBLIC_API_URL || "localhost:3001") ||
    url.startsWith("/api") ||
    url.includes("/api/");

  // Add authentication header for API requests
  if (isApiRequest) {
    // Load auth service dynamically
    const { authService } = await loadAuthService();
    const token = authService.getToken();

    if (token) {
      // Validate token before making request
      if (authService.isTokenExpired(token)) {
        authService.logout("Your session has expired. Please log in again.");
        throw new Error("Token expired");
      }

      // Add authorization header
      modifiedHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  // Update the init object with modified headers
  modifiedInit.headers = modifiedHeaders;

  try {
    // Make the actual request
    const response = await originalFetch(input, modifiedInit);

    // Handle 401 responses globally
    if (response.status === 401) {
      // Load auth service dynamically
      const { authService } = await loadAuthService();
      authService.logout("Your session is invalid. Please log in again.");
      throw new Error("Unauthorized");
    }

    return response;
  } catch (error) {
    // Re-throw the error
    throw error;
  }
};

// Replace the global fetch function
export const setupHttpInterceptor = () => {
  window.fetch = interceptedFetch;
};

// Restore the original fetch function (useful for testing)
export const restoreOriginalFetch = () => {
  window.fetch = originalFetch;
};

// Export the intercepted fetch for manual use
export { interceptedFetch };
