import rss from '@astrojs/rss';
import { withBase } from '../../lib/site';

// Static fallback; in production the Worker serves this feed from D1.
export async function GET(context: { site: URL }) {
  return rss({
    title: "HSL's Blog",
    description: 'HSL checks prices, benchmarks and marketing claims for AI models, cars and devices against the original sources',
    site: new URL(withBase('/en/'), context.site),
    items: [],
  });
}
