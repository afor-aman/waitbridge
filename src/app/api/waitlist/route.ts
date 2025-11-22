import { db } from '@/db/drizzle';
import { schema } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser } from '@/utils/getCurrentUser';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const waitlists = await db
      .select()
      .from(schema.waitlist)
      .where(eq(schema.waitlist.userId, user.id));
    return Response.json(waitlists);
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { name, description } = await request.json();
    if (!name) {
      return new Response('Name is required', { status: 400 });
    }
    const [newWaitlist] = await db
      .insert(schema.waitlist)
      .values({
        id: crypto.randomUUID(),
        name,
        description,
        userId: user.id,
      })
      .returning();
    return Response.json(newWaitlist);
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response('ID is required', { status: 400 });
    }
    
    // Verify ownership before deleting
    const [waitlist] = await db
      .select()
      .from(schema.waitlist)
      .where(eq(schema.waitlist.id, id));
    
    if (!waitlist) {
      return new Response('Waitlist not found', { status: 404 });
    }
    
    if (waitlist.userId !== user.id) {
      return new Response('Forbidden', { status: 403 });
    }
    
    await db.delete(schema.waitlist).where(eq(schema.waitlist.id, id));
    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
