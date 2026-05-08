import { NextResponse } from 'next/server';
// @ts-ignore
import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

const TIER_PRICES: Record<string, number> = {
  'Starter': 499000,
  'Enterprise': 1499000,
  'Sovereign': 4999000,
};

export async function POST(req: Request) {
  try {
    const { tier } = await req.json();
    const price = TIER_PRICES[tier] || 0;

    if (price === 0) {
      return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
    }

    const orderId = `BERNAS-SEO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price,
      },
      item_details: [
        {
          id: tier.toLowerCase(),
          price: price,
          quantity: 1,
          name: `Bernas SEO Suite - ${tier} Tier`,
        },
      ],
      customer_details: {
        first_name: "Bernas",
        last_name: "Customer",
        email: "customer@bernas.id",
      },
    };

    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token, orderId });
  } catch (error: any) {
    console.error('Midtrans Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
