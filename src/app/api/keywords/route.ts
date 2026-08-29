import { NextRequest, NextResponse } from 'next/server';
import { GoogleAdsApi, enums } from 'google-ads-api';

interface KeywordMetrics {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competitionLevel: string;
  score: number;
  words: number;
}

export async function GET(req: NextRequest) {
  const seed = req.nextUrl.searchParams.get('q');
  if (!seed) return NextResponse.json({ error: 'Missing q param' }, { status: 400 });

  try {
    // 1. ALWAYS get long-tail suggestions from Google Autocomplete first
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=id&gl=id&q=${encodeURIComponent(seed)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'SEOsuite/3.0' } });
    const data = await res.json();
    const suggestions: string[] = data[1] || [];

    const modifiers = ['cara', 'tips', 'apa itu', 'terbaru', 'harga', 'review', 'manfaat', 'dampak'];
    const expanded: string[] = [];
    
    const expandPromises = modifiers.slice(0, 4).map(async mod => {
      try {
        const mUrl = `https://suggestqueries.google.com/complete/search?client=firefox&hl=id&gl=id&q=${encodeURIComponent(`${seed} ${mod}`)}`;
        const mRes = await fetch(mUrl, { headers: { 'User-Agent': 'SEOsuite/3.0' } });
        const mData = await mRes.json();
        return (mData[1] || []) as string[];
      } catch { return []; }
    });

    const results = await Promise.allSettled(expandPromises);
    for (const r of results) {
      if (r.status === 'fulfilled') expanded.push(...r.value);
    }

    const allAutocomplete = [...new Set([...suggestions, ...expanded])].filter(s => s.toLowerCase() !== seed.toLowerCase());
    
    // Default metrics mapping
    let finalKeywords: KeywordMetrics[] = allAutocomplete.map(kw => {
      let score = 50;
      if (kw.includes(seed)) score += 20;
      if (kw.split(' ').length >= 3) score += 15;
      if (kw.split(' ').length >= 5) score += 10;
      if (/\d{4}/.test(kw)) score += 5;
      return { 
        keyword: kw, 
        score: Math.min(100, score), 
        words: kw.split(' ').length,
        searchVolume: 0,
        cpc: 0,
        competitionLevel: 'UNSPECIFIED'
      };
    });

    let source = 'Autocomplete (Fallback)';

    // 2. Enrich with Google Ads API (if configured)
    const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
    const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
    const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;
    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;

    if (clientId && clientSecret && developerToken && refreshToken && customerId && allAutocomplete.length > 0) {
      try {
        const client = new GoogleAdsApi({
          client_id: clientId,
          client_secret: clientSecret,
          developer_token: developerToken,
        });

        const customer = client.Customer({
          customer_id: customerId,
          login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || customerId,
          refresh_token: refreshToken,
        });

        // We can pass up to 10000 keywords
        const keywordsToQuery = allAutocomplete.slice(0, 500); // Limit just in case
        
        const response: any = await customer.keywordPlanIdeas.generateKeywordIdeas({
          customer_id: customerId,
          language: 'languageConstants/1033',
          geo_target_constants: ['geoTargetConstants/2360'],
          keyword_seed: {
            keywords: keywordsToQuery
          },
          keyword_plan_network: enums.KeywordPlanNetwork.GOOGLE_SEARCH
        } as any);

        const ideasArray = Array.isArray(response) ? response : (response.results || response.keyword_ideas || response.keywordIdeas || []);

        if (ideasArray && ideasArray.length > 0) {
          source = 'Autocomplete + Google Ads API';
          
          // Create a lookup map for faster processing
          const adsMetricsMap = new Map();
          ideasArray.forEach((idea: any) => {
            if (idea.text && idea.keyword_idea_metrics) {
              const metrics = idea.keyword_idea_metrics;
              const sv = metrics.avg_monthly_searches ? parseInt(metrics.avg_monthly_searches.toString(), 10) : 0;
              const cpcMicros = metrics.high_top_of_page_bid_micros || metrics.low_top_of_page_bid_micros || 0;
              const cpc = typeof cpcMicros === 'number' ? cpcMicros / 1000000 : (cpcMicros ? Number(cpcMicros) / 1000000 : 0);
              
              adsMetricsMap.set(idea.text.toLowerCase(), {
                searchVolume: sv,
                cpc: cpc,
                competitionLevel: metrics.competition || 'UNSPECIFIED'
              });
            }
          });

          // Update finalKeywords with real data
          finalKeywords = finalKeywords.map(kw => {
            const adsData = adsMetricsMap.get(kw.keyword.toLowerCase());
            if (adsData) {
              // Adjust score based on search volume
              const svScore = Math.min(50, Math.log10(adsData.searchVolume + 1) * 10);
              kw.searchVolume = adsData.searchVolume;
              kw.cpc = adsData.cpc;
              kw.competitionLevel = adsData.competitionLevel;
              kw.score = Math.min(100, 50 + svScore); // 50 base + 50 SV
            }
            return kw;
          });
        }
      } catch (adsError) {
        console.error("Google Ads API Error:", adsError);
      }
    }

    // Sort: If we have volume, sort by volume, else by fallback score
    if (source.includes('Ads API')) {
      finalKeywords.sort((a, b) => b.searchVolume - a.searchVolume);
    } else {
      finalKeywords.sort((a, b) => b.score - a.score);
    }

    return NextResponse.json({
      seed,
      total: finalKeywords.length,
      source,
      keywords: finalKeywords,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
