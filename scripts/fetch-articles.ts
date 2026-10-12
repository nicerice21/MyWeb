import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

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
  // TODO: parse XML with fast-xml-parser
  return [];
}

async function main() {
  const qiitaUserId = process.env.QIITA_USER_ID || 'xxx';
  const hatenaOrigin = process.env.HATENA_BLOG_ORIGIN || 'xxx.hatenablog.com';

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
