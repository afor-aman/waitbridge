import { db } from '@/db/drizzle';
import { schema } from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
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

    // Get total count
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.waitlistEntry)
      .where(eq(schema.waitlistEntry.waitlistId, id));

    // Get growth over time (last 30 days, grouped by day)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const growthData = await db
      .select({
        date: sql<string>`DATE(${schema.waitlistEntry.createdAt})::text`,
        count: sql<number>`count(*)::int`,
      })
      .from(schema.waitlistEntry)
      .where(
        and(
          eq(schema.waitlistEntry.waitlistId, id),
          sql`${schema.waitlistEntry.createdAt} >= ${thirtyDaysAgo}`
        )
      )
      .groupBy(sql`DATE(${schema.waitlistEntry.createdAt})`)
      .orderBy(sql`DATE(${schema.waitlistEntry.createdAt})`);

    // Get recent signups (last 10)
    const recentEntries = await db
      .select({
        id: schema.waitlistEntry.id,
        email: schema.waitlistEntry.email,
        createdAt: schema.waitlistEntry.createdAt,
      })
      .from(schema.waitlistEntry)
      .where(eq(schema.waitlistEntry.waitlistId, id))
      .orderBy(desc(schema.waitlistEntry.createdAt))
      .limit(10);

    // Format growth data for chart
    const chartData = growthData.map((item) => ({
      date: item.date,
      signups: Number(item.count),
    }));

    return Response.json({
      total: Number(totalCountResult[0]?.count || 0),
      growth: chartData,
      recent: recentEntries.map((entry) => ({
        id: entry.id,
        email: entry.email,
        createdAt: entry.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

