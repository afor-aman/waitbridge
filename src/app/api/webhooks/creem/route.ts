//handle multiple  hit for same evensts from creem

import { db } from '@/db/drizzle';
import { schema } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as crypto from 'crypto';
import { nanoid } from 'nanoid';

/**
 * Verify Creem.io webhook signature
 */
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return computedSignature === signature;
}

/**
 * Webhook endpoint for Creem.io payment notifications
 * 
 * This endpoint handles payment events from Creem.io and updates user payment status.
 * 
 * Expected webhook events:
 * - checkout.completed: When a checkout is successfully completed
 * 
 * The webhook secret should be set in the CREEM_WEBHOOK_SECRET environment variable.
 * 
 * Payload structure:
 * {
 *   eventType: 'checkout.completed',
 *   object: {
 *     customer: { email: string, id: string },
 *     order: { status: 'paid', type: 'onetime' },
 *     status: 'completed'
 *   }
 * }
 */
export async function POST(request: Request) {
  try {
    // Get webhook secret from environment variable
    const webhookSecret = process.env.CREEM_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('CREEM_WEBHOOK_SECRET is not set');
      return new Response('Webhook secret not configured', { status: 500 });
    }

    // Get the signature from headers
    const signature = request.headers.get('creem-signature');
    
    if (!signature) {
      return new Response('Missing creem-signature header', { status: 401 });
    }

    // Read the raw body for signature verification
    const rawBody = await request.text();
    
    // Verify the signature
    const isValid = verifySignature(rawBody, signature, webhookSecret);
    
    if (!isValid) {
      console.error('Invalid webhook signature');
      return new Response('Invalid signature', { status: 401 });
    }

    // Parse the webhook payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (error) {
      return new Response('Invalid JSON payload', { status: 400 });
    }

    // Handle different webhook event types
    const eventType = payload.eventType || payload.type || payload.event;
    
    if (eventType === 'checkout.completed') {
      // Verify checkout is completed and order is paid
      const checkout = payload.object;
      if (!checkout) {
        return new Response('Invalid payload: missing object', { status: 400 });
      }

      // Verify checkout status
      if (checkout.status !== 'completed') {
        console.log(`Checkout not completed. Status: ${checkout.status}`);
        return Response.json({ 
          success: true, 
          message: 'Checkout not completed, skipping' 
        });
      }

      // Verify order is paid and is a one-time payment
      const order = checkout.order;
      if (!order) {
        return new Response('Invalid payload: missing order', { status: 400 });
      }

      if (order.status !== 'paid') {
        console.log(`Order not paid. Status: ${order.status}`);
        return Response.json({ 
          success: true, 
          message: 'Order not paid, skipping' 
        });
      }

      if (order.type !== 'onetime') {
        console.log(`Order is not one-time. Type: ${order.type}`);
        return Response.json({ 
          success: true, 
          message: 'Order is not one-time, skipping' 
        });
      }

      // Extract customer email from the payload
      const customer = checkout.customer;
      if (!customer) {
        return new Response('Invalid payload: missing customer', { status: 400 });
      }

      const email = customer.email;
      if (!email) {
        console.error('No customer email found in webhook payload:', payload);
        return new Response('Customer email not found in payload', { status: 400 });
      }

      // Update user payment status by email
      const result = await db
        .update(schema.user)
        .set({ payment: true })
        .where(eq(schema.user.email, email))
        .returning({ id: schema.user.id, email: schema.user.email });

      if (result.length > 0) {
        console.log(`Payment status updated for user: ${email} (${result[0].id})`);
        return Response.json({ 
          success: true, 
          message: 'Payment status updated',
          userId: result[0].id
        });
      } else {
        // User doesn't exist yet - store as pending payment
        // Will be applied when user signs up
        console.log(`User not found for payment, storing as pending: ${email}`);
        
        // Upsert pending payment (in case of duplicate webhook calls)
        await db
          .insert(schema.pendingPayment)
          .values({
            id: nanoid(),
            email: email,
            customerId: customer.id || null,
            paymentData: payload,
          })
          .onConflictDoUpdate({
            target: schema.pendingPayment.email,
            set: {
              customerId: customer.id || null,
              paymentData: payload,
            },
          });

        console.log(`Pending payment stored for: ${email}`);
        return Response.json({ 
          success: true, 
          message: 'Payment stored as pending - will be applied when user signs up',
          email: email
        });
      }
    }

    // Log unhandled event types for debugging
    console.log('Unhandled webhook event type:', eventType, payload);
    
    return Response.json({ 
      success: true, 
      message: 'Event received but not processed' 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

