import { getCollection, type CollectionEntry } from 'astro:content';

type Story = CollectionEntry<'stories'>;

// Project stories whose publishedAt has arrived. A future-dated part stays out of every listing, page and
// sitemap until a build on or after that day (AGENTS.md section 12: parts are published spread out).
export const getStories = async (filter: (entry: Story) => boolean = () => true) => {
  const now = Date.now();
  return getCollection('stories', (entry) => entry.data.publishedAt.getTime() <= now && filter(entry));
};
