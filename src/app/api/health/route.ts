import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'SEOsuite API',
    version: '1.0.0',
    modules: ['audit', 'pilar', 'health'],
    timestamp: new Date().toISOString(),
  });
}
