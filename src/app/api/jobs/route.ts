import { NextResponse } from 'next/server';

interface JobRequestBody {
  orderCode: string;
  service: string;
  category: string;
  tier: string;
  instruction: string;
  brief: string;
  scope: string | null;
  client: {
    name: string;
    phone: string;
    company: string | null;
  };
  callbackUrl: string;
}

interface CallbackPayload {
  jobId: string;
  status: 'COMPLETED' | 'FAILED';
  resultUrl?: string;
  resultLabel?: string;
  message: string;
}

function extractUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s"'<>]+/);
  if (match) return match[0];
  // Fallback: bare domain (e.g. "example.com")
  const domain = text.match(/\b([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(?:\/\S*)?\b/);
  return domain ? `https://${domain[0]}` : null;
}

async function sendCallback(callbackUrl: string, payload: CallbackPayload): Promise<void> {
  try {
    await fetch(callbackUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('[jobs] Callback gagal ke', callbackUrl, err);
  }
}

export async function POST(req: Request) {
  // 1. Validasi API Key
  const apiKey = req.headers.get('x-api-key');
  const expectedKey = process.env.ENGINE_API_KEY ?? process.env.INTERNAL_API_KEY ?? '';

  if (!expectedKey || apiKey !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse body
  let body: JobRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body tidak valid (bukan JSON)' }, { status: 400 });
  }

  const { brief, callbackUrl, orderCode } = body;

  if (!brief || !callbackUrl) {
    return NextResponse.json({ error: 'Field brief dan callbackUrl wajib diisi' }, { status: 400 });
  }

  // 3. Generate jobId unik
  const jobId = crypto.randomUUID();

  console.log(`[jobs] Job diterima — jobId=${jobId} orderCode=${orderCode ?? '-'}`);

  // 4. Balas 200 langsung
  const response = NextResponse.json({ jobId }, { status: 200 });

  // 5. Proses async (non-blocking)
  setTimeout(async () => {
    const clientUrl = extractUrl(brief);

    if (clientUrl) {
      const appBase =
        process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3060';
      const auditEndpoint = `${appBase}/api/audit`;

      console.log(`[jobs] ${jobId} — Memanggil audit untuk URL: ${clientUrl}`);
      try {
        await fetch(auditEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: clientUrl }),
        });
      } catch (err) {
        console.error(`[jobs] ${jobId} — Audit fetch error:`, err);
      }

      await sendCallback(callbackUrl, {
        jobId,
        status: 'COMPLETED',
        message: 'Audit SEO selesai diproses.',
      });
    } else {
      console.log(`[jobs] ${jobId} — Tidak ada URL ditemukan di brief, skip audit.`);
      await sendCallback(callbackUrl, {
        jobId,
        status: 'COMPLETED',
        message: 'SEO job diterima — tim akan mengaudit website Anda.',
      });
    }
  }, 0);

  return response;
}
