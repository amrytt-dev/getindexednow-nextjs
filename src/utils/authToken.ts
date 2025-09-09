import { getFirebaseAuth } from "./firebaseClient";

export async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    const auth = getFirebaseAuth();
    if (auth?.currentUser) {
      // Use cached token to avoid triggering token-changed events on each request
      // Firebase will auto-refresh when needed; callers can force refresh explicitly if required
      return await auth.currentUser.getIdToken();
    }
  } catch (_) {
    // noop
  }

  return null;
}

export async function getAuthHeader(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
