import { db } from '@/db/drizzle';
import { schema } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
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
    
    const [waitlist] = await db
      .select({ settings: schema.waitlist.settings })
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
    
    return Response.json({ settings: waitlist.settings });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { id } = await params;
    const settings = await request.json();
    
    // Verify ownership before updating
    const [existingWaitlist] = await db
      .select()
      .from(schema.waitlist)
      .where(
        and(
          eq(schema.waitlist.id, id),
          eq(schema.waitlist.userId, user.id)
        )
      );
    
    if (!existingWaitlist) {
      return new Response('Waitlist not found', { status: 404 });
    }
    
    const [updatedWaitlist] = await db
      .update(schema.waitlist)
      .set({ 
        settings: settings,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(schema.waitlist.id, id),
          eq(schema.waitlist.userId, user.id)
        )
      )
      .returning({ settings: schema.waitlist.settings });
    
    return Response.json({ settings: updatedWaitlist.settings });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
