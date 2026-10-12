# MyWeb — ポートフォリオサイト

Astro + Cloudflare Workers (Static Assets) で構成した、学生エンジニアの軽量ポートフォリオサイト。

## 構成

- **フレームワーク**: Astro (static output)
- **ホスティング**: Cloudflare Workers (assets-only)
- **画像**: Cloudflare R2 (カスタムドメイン直結)
- **ブログ**: 内製せず、Qiita / はてなブログをビルド時に集約
- **CMS**: なし (github.dev で直接編集)

## 開発

```bash
npm install
npm run dev        # ローカル開発
npm run build      # 静的生成
npm run deploy     # ビルド + Cloudflare Workers へデプロイ
```

## ドキュメント

- [技術構成](docs/architecture.md)
- [デザイン仕様](docs/design/design.md)
- [デザインモックアップ](docs/design/mockup.html)
- [コンテンツ設計](docs/content.md)

## ライセンス

MIT
