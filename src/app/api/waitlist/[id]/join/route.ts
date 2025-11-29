import { db } from '@/db/drizzle';
import { schema } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { email, name } = body;
    
    console.log('[Waitlist Join] Received request:', {
      waitlistId: id,
      email,
      name,
      hasName: name !== undefined && name !== null,
      nameType: typeof name,
      nameValue: name,
    });
    
    if (!email || !email.includes('@')) {
      return new Response('Valid email is required', { status: 400 });
    }
    
    // Check if waitlist exists
    const [waitlist] = await db
      .select()
      .from(schema.waitlist)
      .where(eq(schema.waitlist.id, id));
    
    if (!waitlist) {
      return new Response('Waitlist not found', { status: 404 });
    }
    
    // Check if email already exists for this waitlist
    const [existingEntry] = await db
      .select()
      .from(schema.waitlistEntry)
      .where(
        and(
          eq(schema.waitlistEntry.waitlistId, id),
          eq(schema.waitlistEntry.email, email.toLowerCase())
        )
      );
    
    if (existingEntry) {
      return Response.json({ 
        success: false, 
        message: 'This email is already on the waitlist!',
        alreadyExists: true 
      }, { status: 409 });
    }
    
    // Create new entry
    try {
      const nameValue = name ? name.trim() : null;
      const entryData = {
        id: crypto.randomUUID(),
        waitlistId: id,
        email: email.toLowerCase(),
        name: nameValue,
      };
      
      console.log('[Waitlist Join] Inserting entry:', entryData);
      
      const [newEntry] = await db
        .insert(schema.waitlistEntry)
        .values(entryData)
        .returning();
      
      console.log(`[Waitlist Join] New entry created successfully:`, {
        waitlistId: id,
        email: email.toLowerCase(),
        name: newEntry.name,
        entryId: newEntry.id,
        timestamp: new Date().toISOString(),
      });
      
      return Response.json({ 
        success: true, 
        message: 'Successfully joined the waitlist!',
        entry: newEntry 
      });
    } catch (insertError: any) {
      // Handle unique constraint violation (duplicate email)
      if (insertError?.code === '23505' || insertError?.message?.includes('unique') || insertError?.message?.includes('duplicate')) {
        return Response.json({ 
          success: false, 
          message: 'This email is already on the waitlist!',
          alreadyExists: true 
        }, { status: 409 });
      }
      throw insertError; // Re-throw if it's a different error
    }
  } catch (error) {
    console.error('[Waitlist Join] Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

