import { createAuthClient } from "better-auth/react"

// Use environment variable for baseURL, fallback to same origin if not set
// For client-side, we can use window.location.origin
// For server-side, we rely on NEXT_PUBLIC_BASE_URL or omit baseURL (same origin)
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin;
  }
  // Server-side: use env variable or undefined (same origin)
  return process.env.NEXT_PUBLIC_BASE_URL || undefined;
};

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: getBaseURL()
})

// Export hooks from the same client instance to avoid duplicate clients
export const { signIn, signUp, useSession, signOut } = authClient