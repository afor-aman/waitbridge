import { auth } from '@/lib/auth';

/**
 * Shared utility function to get the current authenticated user from a request.
 * Used across all API routes to avoid code duplication.
 */
export async function getCurrentUser(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user;
}

