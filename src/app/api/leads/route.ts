/**
 * /api/leads/route.ts — Admin Leads Management API Endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllLeads, updateLeadStatus } from '@/lib/audit-store';

export async function GET() {
  try {
    const leads = await getAllLeads();
    return NextResponse.json({ success: true, leads });
  } catch (err) {
    console.error('Failed to fetch leads:', err);
    return NextResponse.json({ error: 'Gagal mengambil data leads' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID dan status wajib disertakan' }, { status: 400 });
    }

    if (!['new', 'contacted', 'won', 'lost'].includes(status)) {
      return NextResponse.json({ error: 'Nilai status tidak valid' }, { status: 400 });
    }

    const updated = await updateLeadStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Lead tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Status lead berhasil diperbarui' });
  } catch (err) {
    console.error('Failed to update lead status:', err);
    return NextResponse.json({ error: 'Gagal memperbarui status lead' }, { status: 500 });
  }
}
