import { NextResponse } from 'next/server';

// API route to check if cars are still available at mobile.de dealers
// In production this would run as a cron job (e.g. Vercel Cron)
// GET /api/check-availability?secret=YOUR_SECRET

const DEALERS = [
  { name: 'HJA Auto', url: 'https://home.mobile.de/home/index.html?customerId=28417172' },
  { name: 'Altergott Automobile', url: 'https://home.mobile.de/ALTERGOTTAUTOMOBILE' },
  { name: 'MC Automobile', url: 'https://home.mobile.de/AUTOMOBILE-MC' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Auth check - require CRON_SECRET env var, no hardcoded fallback
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: { dealer: string; status: string; listingsFound: number; error?: string }[] = [];

  for (const dealer of DEALERS) {
    try {
      const res = await fetch(dealer.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
        },
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) {
        results.push({ dealer: dealer.name, status: 'error', listingsFound: 0, error: `HTTP ${res.status}` });
        continue;
      }

      const html = await res.text();

      // Count listings on page - mobile.de uses data-listing-id or similar patterns
      const listingMatches = html.match(/class="cBox-body--resultitem"/g) ||
                             html.match(/data-listing-id/g) ||
                             html.match(/class="seller-listing"/g) || [];

      results.push({
        dealer: dealer.name,
        status: 'ok',
        listingsFound: listingMatches.length,
      });
    } catch (err) {
      results.push({
        dealer: dealer.name,
        status: 'error',
        listingsFound: 0,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  return NextResponse.json({
    checked_at: new Date().toISOString(),
    dealers: results,
    note: 'In production, this would update the database to mark unavailable cars as sold/removed.',
  });
}
