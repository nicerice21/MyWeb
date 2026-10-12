# AGENTS.md

MyWeb — 学生エンジニアのポートフォリオサイト（Astro + Cloudflare）。

## 現状

- **計画フェーズ。コードは未実装**で `docs/` のみ存在。実装は `docs/architecture.md` に従う
- git: `master` ブランチ・コミットゼロ。**コミットはユーザーの明示要求時のみ**
- 言語: ドキュメント・サイト・応答はすべて日本語

## ドキュメントの権限順

| 目的 | 読むもの |
|---|---|
| 技術構成（スタック・CI・将来拡張） | `docs/architecture.md` |
| デザイン仕様（トークン・コンポーネント・ガラス・モーション） | `docs/design/design.md` |
| ビジュアルの実測値（動く一次資料） | `docs/design/mockup.html` |
| IA・コンテンツモデル・ライティング | `docs/content.md` |

実装後はコードが優先。docs と実装が乖離したら docs を更新して揃える。トークンのCSS変数名（`--paper` 等）は mockup と本番で**同名を維持**する。

## 確定済みの意思決定（再提案・再議しない）

- ホスティングは **Workers (Static Assets, assets-only)**。Pages は不可（メンテナンス状態）
- フレームワークは **Astro**（Hugo 不採用のはXMLパースが理由）
- ブログは内製しない。Qiita API + はてな公開フィードを**ビルド時取得**（cron 6時間毎）
- 画像は R2 バケットに**カスタムドメイン直結**（Worker経由にしない）
- D1 なし・CMS なし・ダークモードなし（ダークは mockup に参考記録のみ）
- グラデーションは**藍→朱（#4353C9→#E0644F）の1種のみ**、1ビュー3箇所まで
- Home の Works 上位は `featured` フラグ手動選定。Qiita の likes は取得しない
- About は プロフィール + bio + 経歴のみ（スキル一覧なし）

## mockup.html を編集・検証するとき

- バージョン表記は `<title>` と `.spec-top` の**両方**を bump する
- トークン値を変えたら `design.md` §2 も同期する
- Playwright は `file://` をブロックするため、`docs/design` をローカルHTTPサーバー（例: node ワンライナーで 127.0.0.1:8765）に立てて `http://` で開く。用済み後はサーバーのプロセスを停止する
- フォントは Google Fonts CDN。検証前に2〜3秒待つ（`document.fonts.check` は weight 指定で確認すること）
- fullPage スクリーンショットの前に `.reveal` 全要素へ `is-in` を付与（スペックシート構造上、IO はファーストビュー外で未発火になる）
- 検証項目: 横溢れなし（1280px と 430px）、`.geo-tile.t2` がリングに重なる、`backdrop-filter` の計算値
- favicon 404 のコンソールエラーは無視してよい

## 実装時の注意

- モックの `.reveal` は JS 無効考慮なし。本番は `html.js` ゲーティング必須（`design.md` §7）
- `articles.json` は生成物（gitignore）。fetch スクリプト → astro build の順で `npm run build` に束ねる
- シークレットは GitHub Secrets のみ（`CLOUDFLARE_API_TOKEN` 必須 / `QIITA_ACCESS_TOKEN` 任意）。リポジトリにコミットしない
- モック内の `TARO YAMADA` / `山田 太郎` 等はプレースホルダ。実装時にユーザーの実情報に差し替える
