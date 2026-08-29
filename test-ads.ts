import { GoogleAdsApi, enums } from 'google-ads-api';
import * as fs from 'fs';

function loadEnv() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2].trim();
    }
  });
}

async function run() {
  loadEnv();
  try {
    const client = new GoogleAdsApi({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    });

    const customer = client.Customer({
      customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
      login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || process.env.GOOGLE_ADS_CUSTOMER_ID!,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    });

    const keywords = ['business model', 'business model canvas', 'cara hitung bep', 'laba rugi bisnis', 'strategi pemasaran', 'mentoring bisnis', 'pengembangan bisnis'];
    console.log('Fetching for:', keywords);

    const response: any = await customer.keywordPlanIdeas.generateKeywordIdeas({
      customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
      language: 'languageConstants/1033', // Indonesian
      geo_target_constants: ['geoTargetConstants/2360'], // Indonesia
      keyword_seed: { keywords },
      keyword_plan_network: enums.KeywordPlanNetwork.GOOGLE_SEARCH
    } as any);

    const ideasArray = Array.isArray(response) ? response : (response.results || response.keyword_ideas || response.keywordIdeas || []);
    
    ideasArray.slice(0, 20).forEach((idea: any) => {
      if (idea.text && idea.keyword_idea_metrics) {
        const metrics = idea.keyword_idea_metrics;
        const sv = metrics.avg_monthly_searches ? parseInt(metrics.avg_monthly_searches.toString(), 10) : 0;
        const comp = metrics.competition || 'UNSPECIFIED';
        console.log(`${idea.text}: SV ${sv}, Comp ${comp}`);
      }
    });
  } catch (e) {
    console.error(e);
  }
}
run();