import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the shape of a keyword exported to BERNAS
interface ExportedKeyword {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competitionLevel: string;
  intent: string;
  isBranded: boolean;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const keywords: ExportedKeyword[] = body.keywords || [];

    if (keywords.length === 0) {
      return NextResponse.json({ error: 'No keywords provided' }, { status: 400 });
    }

    // Lokasi penyimpanan di repository BERNAS
    const bernasDataPath = path.resolve('..', 'bernas', 'data');
    
    // Ensure directory exists
    if (!fs.existsSync(bernasDataPath)) {
       fs.mkdirSync(bernasDataPath, { recursive: true });
    }

    const filePath = path.join(bernasDataPath, 'pilar-keywords.json');

    // Read existing
    let existing: ExportedKeyword[] = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        existing = JSON.parse(fileContent);
      } catch (e) {
        console.error("Error reading existing keywords", e);
      }
    }

    // Merge and deduplicate
    const combined = [...existing, ...keywords];
    const uniqueKeywords = Array.from(new Map(combined.map(item => [item.keyword, item])).values());

    // Write back
    fs.writeFileSync(filePath, JSON.stringify(uniqueKeywords, null, 2));

    return NextResponse.json({ success: true, count: uniqueKeywords.length });
  } catch (error: any) {
    console.error('Error exporting keywords:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
