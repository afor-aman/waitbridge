import { db } from '@/db/drizzle';
import { schema } from '@/db/schema';
import { eq, and, desc, sql, ilike, or } from 'drizzle-orm';
import { getCurrentUser } from '@/utils/getCurrentUser';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    
    // Verify ownership
    const [waitlist] = await db
      .select()
      .from(schema.waitlist)
      .where(
        and(
          eq(schema.waitlist.id, id),
          eq(schema.waitlist.userId, user.id)
        )
      );
    
    if (!waitlist) {
      return new Response('Waitlist not found', { status: 404 });
    }

    // Build where conditions
    const whereConditions = [eq(schema.waitlistEntry.waitlistId, id)];
    if (search) {
      whereConditions.push(ilike(schema.waitlistEntry.email, `%${search}%`));
    }

    // Get total count
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.waitlistEntry)
      .where(and(...whereConditions));

    const total = Number(totalCountResult[0]?.count || 0);

    // Get paginated entries
    const offset = (page - 1) * limit;
    const entries = await db
      .select({
        id: schema.waitlistEntry.id,
        email: schema.waitlistEntry.email,
        name: schema.waitlistEntry.name,
        createdAt: schema.waitlistEntry.createdAt,
      })
      .from(schema.waitlistEntry)
      .where(and(...whereConditions))
      .orderBy(desc(schema.waitlistEntry.createdAt))
      .limit(limit)
      .offset(offset);

    return Response.json({
      entries: entries.map((entry) => ({
        id: entry.id,
        email: entry.email,
        name: entry.name,
        createdAt: entry.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

