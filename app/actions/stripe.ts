'use server';

import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';

export async function createCheckoutSession(priceId: string, user: { uid: string; email: string | null }) {
  if (!process.env.NEXT_PUBLIC_URL) {
      throw new Error('NEXT_PUBLIC_URL is not set');
  }

  if (!user || !user.uid) {
    throw new Error('User is not authenticated.');
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_URL}/demo?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/?payment=cancelled`,
    customer_email: user.email ?? undefined,
    client_reference_id: user.uid
  });

  if (checkoutSession.url) {
    redirect(checkoutSession.url);
  } else {
    throw new Error('Could not create Stripe checkout session');
  }
}
