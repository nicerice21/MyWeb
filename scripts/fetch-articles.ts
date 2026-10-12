import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser } from 'fast-xml-parser';
import { SOURCES } from '../src/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

export type Article = {
  title: string;
  url: string;
  publishedAt: string;
  source: 'qiita' | 'hatena';
  tags: string[];
};

async function fetchQiitaArticles(userId: string): Promise<Article[]> {
  const url = `https://qiita.com/api/v2/users/${userId}/items?per_page=100`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Qiita API failed: ${res.status}`);
  const items = await res.json();
  return items.map((item: any) => ({
    title: item.title,
    url: item.url,
    publishedAt: item.created_at,
    source: 'qiita' as const,
    tags: item.tags.map((t: any) => t.name),
  }));
}

async function fetchHatenaArticles(origin: string): Promise<Article[]> {
  const url = `https://${origin}/feed`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Hatena feed failed: ${res.status}`);
  const text = await res.text();
  const feed = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  }).parse(text).feed;
  const entries = Array.isArray(feed.entry) ? feed.entry : feed.entry ? [feed.entry] : [];

  return entries
    .map((entry: any) => {
      const links = Array.isArray(entry.link) ? entry.link : [entry.link];
      const articleLink = links.find((link: any) => link?.['@_rel'] === undefined || link['@_rel'] === 'alternate');
      if (!articleLink?.['@_href'] || !entry.title || !entry.published) return null;

      const categories = Array.isArray(entry.category) ? entry.category : entry.category ? [entry.category] : [];
      return {
        title: entry.title,
        url: articleLink['@_href'],
        publishedAt: entry.published,
        source: 'hatena' as const,
        tags: categories.map((category: any) => category['@_term']).filter(Boolean),
      };
    })
    .filter((article: Article | null): article is Article => article !== null);
}

async function main() {
  const qiitaUserId = process.env.QIITA_USER_ID || SOURCES.qiitaUserId;
  const hatenaOrigin = process.env.HATENA_BLOG_ORIGIN || SOURCES.hatenaBlogOrigin;

  const [qiita, hatena] = await Promise.all([
    fetchQiitaArticles(qiitaUserId),
    fetchHatenaArticles(hatenaOrigin),
  ]);

  const articles: Article[] = [...qiita, ...hatena].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const outDir = resolve(__dirname, '..', 'src', 'data');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'articles.json'), JSON.stringify(articles, null, 2));
  console.log(`Fetched ${articles.length} articles`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
