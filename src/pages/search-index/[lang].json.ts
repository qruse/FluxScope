import type { APIRoute, GetStaticPaths } from 'astro';
import { getStories } from '../../lib/stories';
import { labSectionPath, labSections, projectPath, projects, storyPath } from '../../lib/site';
import type { Lang } from '../../i18n/ui';

// What the home search looks through besides the D1 articles (/api/search): pages that only exist in the static
// build. Loaded by the browser the first time someone uses the search box. The portfolio stays out of the search
// (user instruction, 2026-11-05).
export const getStaticPaths: GetStaticPaths = () => [{ params: { lang: 'ko' } }, { params: { lang: 'en' } }];

const plainText = (markdown: string) => markdown
  .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/<[^>]+>/g, ' ')
  .replace(/[#*`|>\\]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Lang;
  const isKo = lang === 'ko';
  const name = (entry: { name: string; nameKo: string }) => (isKo ? entry.nameKo : entry.name);
  const sectionLabel = (id: (typeof labSections)[number]['id']) => name(labSections.find((section) => section.id === id)!);
  const stories = (await getStories((entry) => entry.data.lang === lang)).sort((a, b) => a.data.part - b.data.part);
  const items = [
    ...projects.map((project) => ({
      label: sectionLabel('projects'),
      title: name(project),
      description: isKo ? project.summaryKo : project.summary,
      url: projectPath(project.id, lang),
    })),
    ...stories.map((story) => {
      const project = projects.find((entry) => entry.id === story.data.project);
      const part = isKo ? `${story.data.part}편` : `Part ${story.data.part}`;
      return {
        label: `${sectionLabel('stories')} · ${project ? `${name(project)} ` : ''}${part}`,
        title: story.data.title,
        description: story.data.description,
        url: storyPath(story.id.split('/')[1], lang),
        text: plainText(story.body ?? ''),
      };
    }),
    ...labSections.filter((section) => section.id !== 'portfolio').map((section) => ({
      label: isKo ? '메뉴' : 'Section',
      title: name(section),
      description: '',
      url: labSectionPath(section, lang),
    })),
  ];
  return new Response(JSON.stringify(items), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
