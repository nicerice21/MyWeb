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

学生エンジニアのポートフォリオ。Markdown で書いた内容を Astro で静的生成し、Workers と R2 で配信する。月額コストは 0 円。

## 設計

技術構成は docs/architecture.md に担保した。ページは静的生成のみで、外部ブログ（Qiita / はてな）はビルド時に API・フィードから取得してリンクとして一覧化する。D1 は書き込み要件が出るまで導入しない。

## 結果

- Lighthouse: Performance 100 / Accessibility 100
- 転送量: 初回読み込み 50KB 未満
- デプロイ: push + cron（6時間毎）で自動

## 学び

**学び:** 「書き込み要件のないサイトにDBを置かない」という判断だけで、運用とコストの両方を最小化できる。
