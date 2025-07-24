// pages/api/webhooks/stripe.ts
import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY;

    try {
      const event = stripe.webhooks.constructEvent(buf, sig, webhookSecret!);
      switch (event.type) {
        case 'checkout.session.completed':
          console.log('支付完成:', event.data.object);
          // 在這裡更新你的資料庫，例如記錄訂單狀態
          break;
        default:
          console.log(`未處理的事件類型: ${event.type}`);
      }
      res.status(200).json({ received: true });
    } catch (error) {
      res.status(400).send(`Webhook Error: ${(error as any).message}`);
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}