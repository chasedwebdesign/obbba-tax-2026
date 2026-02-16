import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    // 1. Read the user's specific data from the "Buy" button
    const body = await req.json();
    const { base, tips, overtime, state } = body;

    // 2. Create the Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      // 3. MAGIC MOMENT: We attach their data to the Success URL
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?base=${base}&tips=${tips}&overtime=${overtime}&state=${state}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}