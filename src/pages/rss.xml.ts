import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { postPath, publishedPosts, site, withBase } from '../lib/site';

export async function GET(context: { site: URL }) {
  const posts = publishedPosts(await getCollection('posts'));
  return rss({
    title: site.name,
    description: site.description,
    site: new URL(withBase('/'), context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: postPath(post),
    })),
  });
}
