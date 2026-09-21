import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { publishedPosts, site } from '../lib/site';

export async function GET(context: { site: URL }) {
  const posts = publishedPosts(await getCollection('posts'));
  return rss({
    title: site.name,
    description: site.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: `${import.meta.env.BASE_URL}${post.id}/`,
    })),
  });
}
