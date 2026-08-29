import { NextResponse } from 'next/server';
// @ts-expect-error — paket midtrans-client tidak menyertakan berkas tipe
import midtransClient from 'midtrans-client';

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

// Kunci WAJIB sama persis dengan nama tier di src/app/page.tsx (TIERS[].name).
// Sebelumnya berisi 'Starter'/'Enterprise' sementara UI mengirim
// 'Personal'/'Merchant', sehingga SEMUA tombol beli dibalas HTTP 400.
// Nama lama dipertahankan sebagai alias supaya tautan/integrasi lama tidak mati.
const TIER_PRICES: Record<string, number> = {
  Personal: 499000,
  Merchant: 1499000,
  Sovereign: 4999000,
  // alias lama
  Starter: 499000,
  Enterprise: 1499000,
};

export async function POST(req: Request) {
  try {
    const { tier } = await req.json();

    if (typeof tier !== 'string' || !(tier in TIER_PRICES)) {
      return NextResponse.json(
        {
          error: `Paket "${tier}" tidak dikenali. Pilih salah satu: ${Object.keys(TIER_PRICES).join(', ')}.`,
        },
        { status: 400 },
      );
    }

    const price = TIER_PRICES[tier];

    const orderId = `ADOLOSEO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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
          // Muncul di dalam popup Midtrans Snap — permukaan yang DILIHAT
          // PELANGGAN. Sebelumnya masih bertuliskan merek lama "Bernas SEO Suite".
          name: `AdoloSEO - ${tier}`,
        },
      ],
      customer_details: {
        first_name: 'AdoloSEO',
        last_name: 'Customer',
        email: 'halo@adolo.id',
      },
    };

    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token, orderId });
  } catch (error: unknown) {
    console.error('Midtrans Error:', error);
    const message =
      error instanceof Error ? error.message : 'Gagal membuat transaksi pembayaran.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
