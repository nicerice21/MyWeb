# コンテンツ設計 — MyWeb ポートフォリオ

- 更新日: 2026-10-12
- ステータス: 確定（初期コンテンツの充て込みは未）
- 関連: [architecture.md](./architecture.md)（技術構成） / [design/design.md](./design/design.md)（デザイン仕様）

## 1. コンテンツの目的と読者

| 読者 | 伝えたいこと | 所要時間の目安 |
| --- | --- | --- |
| 選考・採用の担当者 | 「何を作り、何を学んだ人か」が事実ベースで分かる | 3分 |
| 同期・コミュニティのエンジニア | 記事・制作物への入口になる | 30秒 |
| 自分 | 制作と学習の記録を正規化して蓄積する | — |

原則: **「作ったもの」と「書いたもの」を最短距離で提示する。** 独自のブログは持たず、文章は Qiita / はてなブログに集約し、本サイトは案内役に徹する（重複コンテンツを作らない）。

## 2. 情報設計（IA）と URL

```
/                     Home（.hero + About概要 + Works上位 + Articles上位）
/about                プロフィール（bio / スキル / 経歴）
/projects             制作物一覧
/projects/[slug]      制作物詳細（本文はMarkdown）
/articles             外部記事（Qiita / はてな）のリンク集
/contact              連絡先（リンク集。フォームなし＝D1不使用の決定どおり）
404                   幾何学装飾＋「このページは存在しません」
```

- 日本語のみ（英字はデザイン上のアクセントのみ）
- ナビは design.md の Header 仕様（ABOUT / PROJECTS / ARTICLES / CONTACT）

## 3. ページ別コンテンツ仕様

### 3.1 Home（`/`）

| セクション | 内容 | データソース |
| --- | --- | --- |
| Hero | 名前（英字ロゴ）・肩書き・リード文1〜2文・CTA2個（Projects を見る / About） | site config + 手書きコピー |
| About 概要 | bio の抜粋（2段落程度）＋ MetaList（名前/所属/分野/興味） | `about` コンテンツ |
| Works 上位 | featured プロジェクト **4件**（2×2グリッド） | projects の `featured: true` を新着順 |
| Articles 上位 | 記事 **5件**（一覧と同デザイン）＋ ALL ARTICLES リンク | `articles.json` |

- Hero コピーの型（design.md のプレースホルダ「幾何学と、ノートのあいだ。」を置き換える）:
  - 1行目: 自分の作るものの特徴を短い名詞句で（例: 「消えてなくなるインフラと、残る文章。」）
  - 2行目: 具体の活動（例: 「静的サイトとエッジのあいだで作る。」）
  - リード: 30〜60字で「誰が・何をしているか」

### 3.2 About（`/about`）

| ブロック | 内容 |
| --- | --- |
| プロフィール | MetaList（名前 / 所属 / 分野 / 興味）— design.md 準拠 |
| bio 本文 | 2〜3段落（400〜600字）。現在の関心と背景を「ノートに書き留める」調で |
| 経歴 | 年表リスト（年 + 1行の事実）。受賞・資格・インターン等 |

スキル一覧は載せない（プロジェクトのタグと本文の技術選定で十分伝わるため）。

### 3.3 Projects（`/projects`, `/projects/[slug]`）

**一覧**: カード（design.md の ProjectCard）。表示は `P-XX`（描画時の自動連番）/ 年 / タイトル / summary / タグ。初期 **3〜6件** を目安に随時追加。

**詳細ページの本文テンプレート**（各 800〜1500字）:

```md
## 概要        … 何を・なぜ（2〜3文）
## 背景        … 課題と制約
## 設計        … 構成と理由。図（R2の画像）を積極的に
## 実装        … 技術選定の理由、コード断片
## 結果        … 数字（速度・コスト・行数）・デモ・反応
## 学び        … 1〜3行、末尾に「**学び:** …」として明示
```

- 必須メタ: `repo`（リポジトリURL）。`demo`・関連記事リンクは任意
- 画像: hero（16:9, 幅1600px, WebP）を1枚 + 本文中に必要に応じて
- 本文の見出しは `##` 開始、体言止め可（明朝見出しで映える短い見出し）

### 3.4 Articles（`/articles`）

- 表示項目: Badge（QIITA / HATENA）/ タイトル（正規URLへのリンク）/ タグ / 日付
- 並び: `publishedAt` 降順、全件を1ページに（件数が増えたら年別グループへ拡張）
- 記事本体はコピーしない（SEO・著作権の観点から正規URLへ誘導のみ）
- いいね数等のエンゲージメント指標は取得しない（はてな側に値がなく、不揃いになるため）

### 3.5 Contact（`/contact`）

- 外部リンク集: GitHub / X / Qiita / はてな / email（mailto）— design.md の Footer リンクと同一セット
- 冒頭に1文（例: 「制作や記事について、気軽にどうぞ。」）
- フォーム・D1 は不使用（当面）。将来追加する場合は architecture.md の拡張オプション参照

## 4. コンテンツモデル（Content Collections のスキーマ）

### 4.1 projects

```ts
// src/content.config.ts（projects 部分）
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    summary: z.string().max(120),      // カード・一覧用の一行
    tags: z.array(z.string()).default([]),
    hero: z.string().url().optional(), // R2 の絶対URL
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    relatedArticles: z.array(z.object({
      title: z.string(),
      url: z.string().url(),
    })).default([]),
    featured: z.boolean().default(false), // Home の Works 上位候補
    draft: z.boolean().default(false),
  }),
});
```

### 4.2 about（単一ファイル `src/content/about/index.md`）

```ts
const about = defineCollection({
  loader: glob({ pattern: 'index.md', base: './src/content/about' }),
  schema: z.object({
    name: z.string(),
    affiliation: z.string(),
    field: z.string(),
    interests: z.array(z.string()).default([]),
    history: z.array(z.object({
      year: z.string(),                // "2024"
      event: z.string(),               // 1行の事実
    })).default([]),
  }),
});
```

### 4.3 サイト設定（`src/config.ts`、Content Collection 外）

```ts
export const SITE = {
  name: '山田 太郎',
  enName: 'TARO YAMADA',
  domain: 'https://example.com',
  social: {
    github: 'https://github.com/xxx',
    x: 'https://x.com/xxx',
    qiita: 'https://qiita.com/xxx',
    hatena: 'https://xxx.hatenablog.com',
    email: 'mailto:xxx@example.com',
  },
};

export const SOURCES = {
  qiitaUserId: 'xxx',          // GET /api/v2/users/:id/items
  hatenaBlogOrigin: 'xxx.hatenablog.com', // GET /feed
  qiitaTokenEnv: 'QIITA_ACCESS_TOKEN',    // 任意（レート緩和）
};
```

### 4.4 記事の正規化型（fetch スクリプトの出力）

architecture.md の `Article` 型と同一（拡張なし）:

```ts
type Article = {
  title: string;
  url: string;
  publishedAt: string;              // ISO 8601
  source: 'qiita' | 'hatena';
  tags: string[];
};
```

## 5. サンプルコンテンツ（projects の記述例）

```md
---
title: "MyWeb — このポートフォリオ"
published: 2026-10-12
summary: "Astro + Cloudflare Workers + R2 で構成した、無料枠内で運用する静的ポートフォリオ。"
tags: [Astro, Cloudflare, TypeScript]
hero: "https://img.example.com/2026/myweb-hero.webp"
repo: "https://github.com/xxx/myweb"
featured: true
---

## 概要

学生エンジニアのポートフォリオ。Markdown で書いた内容を Astro で静的生成し、
Workers と R2 で配信する。月額コストは 0 円。

## 設計

技術構成は docs/architecture.md に担保した。ページは静的生成のみで、
外部ブログ（Qiita / はてな）はビルド時に API・フィードから取得して
リンクとして一覧化する。D1 は書き込み要件が出るまで導入しない。

## 結果

- Lighthouse: Performance 100 / Accessibility 100
- 転送量: 初回読み込み 50KB 未満
- デプロイ: push + cron（6時間毎）で自動

## 学び

**学び:** 「書き込み要件のないサイトにDBを置かない」という判断だけで、
運用とコストの両方を最小化できる。
```

## 6. ライティングガイド

| 項目 | 規約 |
| --- | --- |
| トーン | ノートに書き留める調。事実と根拠を中心に、装飾的な形容を避ける。本文はである調、見出しは体言止め可 |
| 数字を残す | 行数・コスト・速度・件数・日付。感覚表現（「爆速」「モダン」）よりも計測値 |
| 学びの明示 | プロジェクト本文の末尾に `**学び:**` で1〜3行 |
| 誇張の禁止 | 「最高」「完全に理解した」等は使わない。未解決の課題も課題として書く |
| 根拠のない指標 | 習熟度バーや自己評価の数値は使わない。分類タグと事実（§3.2）で示す |
| 3分テスト | Home + 任意の詳細1ページだけで「何をしている人か」が判断できるかを推敲時に確認 |
| 表記 | 技術名は原語（Astro / Cloudflare）。数値は半角、単位にスペース（`0 円` `50KB`） |

## 7. SEO / メタデータ

| 項目 | 仕様 |
| --- | --- |
| `<title>` | `ページ名 — TARO YAMADA`（Home のみ `TARO YAMADA — student engineer`） |
| description | 各ページ 80〜110字の要約（projects は `summary` を流用） |
| OGP 画像 | 1200×630。ヒーローのタイポ＋幾何学の共通1枚＋プロジェクトごとの hero（design.md の TODO と同一物） |
| 構造化データ | JSON-LD: `Person`（name / jobTitle / sameAs=SNS一覧）。詳細ページに `CreativeWork`（任意） |
| sitemap | `@astrojs/sitemap` で自動生成。`articles` の外部URLは含めない |

## 8. 画像のコンテンツ運用（R2）

- キー: `projects/<slug>/hero.webp`、本文画像は `projects/<slug>/01.webp` 連番
- 事前最適化: 幅 1600px（hero）/ 800px（本文）、WebP 品質 80 前後（design.md・architecture.md と同一運用）
- 代替テキスト必須（design.md §9 のアクセシビリティ規約）
- ファイルはリポジトリにコミットしない（R2 のみ）

## 9. 更新運用

| 操作 | 手順 |
| --- | --- |
| プロジェクト追加 | `src/content/projects/<slug>.md` を1ファイル作成 → hero 画像を R2 にアップ → push |
| About 更新 | `src/content/about/index.md` を編集 → push |
| 記事の追加 | **何もしない**（Qiita / はてなに投稿すれば cron ビルドで自動反映） |
| 編集環境 | github.dev（リポジトリで `.`）またはローカル。CMS は不使用 |

## 10. 初期コンテンツの量の目安

| コンテンツ | 目安 |
| --- | --- |
| Home コピー | Hero 2行 + リード 1文 + 各セクション導入 40〜80字 |
| About | bio 400〜600字 + 経歴 5〜8行 |
| Projects | 3〜6件 × 800〜1500字（まず `featured` 3件から） |
| Articles | 取得のみ（表示件数: Home 5 / 一覧 全件） |
