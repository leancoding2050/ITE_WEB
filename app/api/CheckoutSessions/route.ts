import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// 檢查環境變量
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // 使用有效 API 版本
});

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();

    // 驗證 items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty items' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: { name: string; price: number; quantity: number }) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, // Stripe 以分為單位
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_BASE_URL}/cancel`,
    });

    return NextResponse.json({ id: session.id }, { status: 200 });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: (error as any).message },
      { status: 500 }
    );
  }
}