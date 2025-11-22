import { db } from '@/db/drizzle';
import { schema } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/utils/getCurrentUser';

/**
 * Get the current user's payment status
 */
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get full user record to check payment status
    const [fullUser] = await db
      .select({ payment: schema.user.payment })
      .from(schema.user)
      .where(eq(schema.user.id, user.id));

    if (!fullUser) {
      return new Response('User not found', { status: 404 });
    }

    return Response.json({ payment: fullUser.payment });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

