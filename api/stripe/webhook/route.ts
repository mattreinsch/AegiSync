import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import type { Stripe } from 'stripe';
import { firestore } from '@/lib/firebase-admin';

async function updateSubscriptionStatus(
    userId: string, 
    subscription: Stripe.Subscription, 
    status: 'active' | 'inactive',
    customerEmail?: string | null
) {
    const userRef = firestore.collection('users').doc(userId);
    const subscriptionData: { [key: string]: any } = {
        stripeCustomerId: subscription.customer,
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    };
    
    // If email is provided, add it to the data.
    // This helps in cases where the webhook creates the user document before client-side code does.
    if (customerEmail) {
        subscriptionData.email = customerEmail;
    }

    console.log(`Updating user ${userId} with subscription data:`, subscriptionData);
    await userRef.set(subscriptionData, { merge: true });
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!webhookSecret) {
      throw new Error('Stripe webhook secret is not set in .env');
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session completed:', session);

      const userId = session.client_reference_id;
      const stripeSubscriptionId = session.subscription;

      if (!userId || !stripeSubscriptionId) {
        console.error('Webhook Error: Missing required session data to fulfill purchase.');
        return new Response('Webhook Error: Missing required session data.', { status: 400 });
      }

      console.log(`Fulfilling purchase for user: ${userId}`);
      
      try {
        const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId as string);
        await updateSubscriptionStatus(
            userId, 
            subscription, 
            'active',
            session.customer_details?.email
        );
        console.log(`Successfully activated subscription for user ${userId}`);
      } catch (error) {
        console.error(`Error fulfilling purchase for user ${userId}:`, error);
        return new Response('Webhook Error: Could not fulfill purchase.', { status: 500 });
      }
      
      break;
    
    case 'customer.subscription.deleted':
    case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        
        // On updated events, status could be active, past_due, canceled, etc.
        // We will treat anything that is not 'active' as inactive for simplicity.
        const status = subscription.status === 'active' ? 'active' : 'inactive';

        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (customer.deleted) {
            console.warn(`Customer ${subscription.customer} is deleted. Cannot find user.`);
            break;
        }

        // Find user by stripeCustomerId
        const usersRef = firestore.collection('users');
        const snapshot = await usersRef.where('stripeCustomerId', '==', subscription.customer).get();

        if (snapshot.empty) {
            console.error(`Webhook Error: Could not find user with Stripe Customer ID ${subscription.customer}`);
            break;
        }

        snapshot.forEach(async (doc) => {
            console.log(`Updating subscription status to '${status}' for user ${doc.id}`);
            await updateSubscriptionStatus(doc.id, subscription, status);
        });
        break;

    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  return new Response(null, { status: 200 });
}
