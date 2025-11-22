import { db } from '@/db/drizzle';
import { schema } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const [waitlist] = await db
      .select()
      .from(schema.waitlist)
      .where(eq(schema.waitlist.id, id));
    
    if (!waitlist) {
      return new Response('Waitlist not found', { status: 404 });
    }
    
    return Response.json(waitlist);
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

