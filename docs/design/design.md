# デザイン仕様 — MyWeb ポートフォリオ

- 更新日: 2026-10-12
- ステータス: 確定（v0.5 時点の仕様）
- ビジュアルの一次資料: [mockup.html](./mockup.html)（トークン・コンポーネント・アニメーションの動く見本）
- 関連: [../architecture.md](../architecture.md)（技術構成）

## 1. コンセプト

**「幾何学」と「ノート」のあいだ。** 4つの原則で組み立てる。

| 原則 | 内容 |
| --- | --- |
| 幾何学のかっこよさ | 1px の線・点で構成。英字は Space Grotesk、メタは JetBrains Mono。シャドウは原則使わない（ガラス・オフセットシャドウのみ例外、§5 §6） |
| ノートの自然さ | 暖色の紙、赤いマージン線、ドットリーダー、明朝の見出し。読む姿勢を妨げない静けさ |
| グラデーション | 「藍 → 朱」の1種のみ。1ビュー3箇所まで（ヒーローの1語＋ロゴマーク＋幾何タイル1つ）。ホバー下線・フッターマークは面積最小の補助扱い |
| ガラスの立体感 | 半透明＋backdrop-filter は「浮遊要素」だけに使う。背景にパターンか色がある場所で限定（§5） |

## 2. デザイントークン

### 2.1 カラー

| トークン | 値 | 用途 |
| --- | --- | --- |
| `--paper` | `#FBFAF6` | 背景（暖色の紙） |
| `--paper-2` | `#F4F2EB` | 副背景（デモ面など） |
| `--ink` | `#1D1C18` | 本文・強い罫線（ヘッダー/フッター/セクション下線） |
| `--ink-2` | `#55524B` | 本文・カード説明（第二情報） |
| `--ink-3` | `#8B877D` | メタ情報・装飾（**意味を持つ情報には使わない**、§9） |
| `--rule` | `#E3E0D5` | 枠線・弱い罫線 |
| `--rule-dot` | `#C9C5B8` | 破線（リスト区切り） |
| `--margin-red` | `#DE8E88` | ノートの赤マージン線・HATENAバッジ |
| `--grad-a` | `linear-gradient(135deg, #4353C9 0%, #E0644F 100%)` | 唯一のグラデーション（藍→朱） |

派生値（ガラス・色滲み用。意味は §5）:

- ガラス塗り: `rgba(251,250,246,.62)`（カード）/ `.55`（タイル）/ `.72`（ヘッダー）
- ガラス縁: `rgba(255,255,255,.65)`（通常）/ `.5`（グラデ塗り側）
- 半透明グラデ: `linear-gradient(135deg, rgba(67,83,201,.85), rgba(224,100,79,.85))`
- 色滲み（カード背面）: `radial-gradient(closest-side, rgba(67,83,201,.13), rgba(224,100,79,.10) 62%, transparent)`

### 2.2 タイポグラフィ

役割を混ぜない。4ファミリー4役割。

| 役割 | フォント | ウェイト |
| --- | --- | --- |
| 見出し | Shippori Mincho B1 | 600（装飾強調時 700） |
| 本文 | Zen Kaku Gothic New | 400 / 500 |
| メタ・ラベル | JetBrains Mono | 400 / 500 |
| 英字ロゴ | Space Grotesk | 600 |

スケール（主要なもの）:

| 要素 | サイズ / 行間 / 字間 |
| --- | --- |
| ヒーロー見出し | `clamp(1.9rem, 4.4vw, 2.9rem)` / 1.42 / .02em |
| セクション見出し | 1.28rem / — / — |
| カード見出し | 1.02rem |
| 本文 | .9–.92rem / 2.1 / —（リーディング広め＝ノートの行間） |
| 説明・注釈 | .82–.84rem / 1.95 |
| メタ（Mono） | .58–.72rem / — / .06–.3em（英字は大文字＋.14em 以上） |
| 英字タグライン | .7rem / — / .26em |

### 2.3 罫線とパターン

- 罫線は 1px。構造線＝`--ink`、枠＝`--rule`、リスト区切り＝`--rule-dot` の破線
- ドットグリッド: `radial-gradient(circle, #C7C3B4 1px, transparent 1.2px)` を `22px 22px` で敷き、`mask-image` の線形グラデーションで端をフェード
- 十字マーカー（PlusMarker）: 9×9px、1px の線 ×2

## 3. レイアウト原則

- コンテナ: 最大幅 920px、左右 padding 40px
- 本文の測定幅（measures）: 最大 33–40em
- セクション: 上下 30px / 56px、セクション見出しの下 36px
- 2カラム（About は `1.55fr : 1fr` gap 48px、カードは `1fr 1fr` gap 16px）
- 基本リズムは 8px 系。シャドウ・角丸は原則なし（ガラス面のみ §5 の値）

## 4. コンポーネント仕様

### Header（`.site-header`）

- `position: sticky; top: 0; z-index: 10`。ガラス面（§5）
- 左: ロゴマーク（10px 四角、`--grad-a` 塗り）＋ `TARO YAMADA`（Space Grotesk 600 .88rem / .06em）
- 右: nav。Mono .66rem / .16em / 大文字。カレントと hover で `--ink` ＋ グラデ下線（2px、`background-size 0%→100%` を .25s）

### Hero（`.hero`）

- 左テキスト（`flex: 1; z-index: 1`）＋右幾何学領域（`width: 320px; margin-left: -72px; z-index: 0`＝**本文の背面に40px回り込む**）
- テキスト列は赤マージン線（`border-left: 1px solid rgba(222,142,136,.55); padding-left: 30px`）
- kicker: Mono .66rem / .2em、前に 26px の水平線
- 見出しの1語のみグラデ文字（`background-clip: text`）
- ボタン: 1px `--ink` 枠 / padding 10px 24px / .82rem 500。hover で反転（ink 塗り×paper 文字）
- リンク: グラデ下線 1.5px が `background-size 0%→100%` で伸びる（.3s）

### GeoField（`.hero-geo`）

ドットグリッド＋次の幾何要素を非対称に配置（位置は mockup 準拠）:

| 要素 | 仕様 |
| --- | --- |
| リング | 148px 円、`1px solid #ADA897` |
| ドット | 11px 円、`--grad-a` 塗り。リングの円周上に乗せる |
| 弧 | 60px、`border-top/right: 1px solid --ink-3`、`rotate(45deg)` |
| IconTile | 48px 四角のガラス面（§5）＋線SVGアイコン（22px / stroke 1.5 / `stroke-linecap: square`）。3枚: terminal / code / pen。うち1枚だけ半透明グラデ塗り |
| 縦ラベル | `writing-mode: vertical-rl`、Mono .58rem / .3em |

アイコンはインラインSVGで持つ（外部アイコンライブラリ不使用）。

### SectionHead（`.sec-head`）

- 下端に 1px `--ink` の構造線
- 構成: `見出し（明朝1.28rem）` のみ

### NoteBlock（`.note`）

本文ブロックの左に赤マージン線（`1px solid rgba(222,142,136,.5); padding-left: 20px`）。About の文章とプロフィールで使用。

### MetaList（`.meta-row`）

ドットリーダーの定義リスト: `dt`（Mono .62rem / .14em、`--ink-3`）＋伸縮ドット（`border-bottom: 1px dotted`、opacity .55）＋ `dd`（.84rem / 500）。

### ProjectCard（`.card`）

- ガラス面（§5）＋フラットなオフセットシャドウ `6px 6px 0 rgba(29,28,24,.05)`（積み紙）
- 構成: `P-01 / 2026`（Mono .62rem）→ 見出し（明朝 1.02rem）→ 説明（.82rem / 1.95）→ チップ（Mono .62rem、1px `--rule` 枠）
- hover: `translate(-3px,-3px)`、シャドウ `9px 9px 0 rgba(29,28,24,.08)`、縁をグラデに（padding-box/border-box 二層background）
- カード群の背後にドットグリッド（#CFCBBB）＋藍/朱の色滲み（§2.1 派生値）を敷く（`::before` / `::after`）

### ArticleRow（`.art-row`）／ Badge

- グリッド `86px 1fr auto`、gap 18px、上下 padding 15px、`--rule-dot` の破線で区切る
- Badge: Mono .58rem / .14em、1px 枠、中央揃え。`QIITA`＝`--ink-3` 枠 / `HATENA`＝`--margin-red` 枠＋`#C26862` 文字
- タイトル .92rem / 500 / 1.6。hover でグラデ下線 1.5px
- タグ（Mono .6rem / .08em）と日付（.64rem / .06em）は `--ink-3`

### Footer

- 中央に 2px × 64px のグラデ線 → 1px `--ink` の構造線 → 左 © 表記・右外部リンク（いずれも Mono .62rem / .14em）

## 5. ガラス仕様

**適用条件（最重要）: 背後にパターンか色がある「浮遊要素」にのみ使う。** 背景が無い場所では blur が効かず、ただの半透明になるため使わない。

| 適用箇所 | 背景 | 背景 | blur | 塗り | 縁 |
| --- | --- | --- | --- | --- | --- |
| Header（sticky） | スクロールする本文 | `blur(10px) saturate(1.15)` | `rgba(251,250,246,.72)` | なし（構造線のみ） |
| IconTile | ドットグリッド＋リング | `blur(6px)` | `rgba(251,250,246,.55)` | `rgba(255,255,255,.65)` |
| ProjectCard | ドットグリッド＋色滲み | `blur(8px)` | `rgba(251,250,246,.62)` | `rgba(255,255,255,.65)` |

- 接頭辞 `-webkit-backdrop-filter` を併記（Safari）
- `prefers-reduced-transparency: reduce` では `--paper` 不透明・blur なしに戻す
- パフォーマンス: blur は 10px まで、適用面積を小さく（ヘッダー1本＋タイル3＋カード4程度）。スクロールに追従する大面積ガラスは作らない

## 6. 立体感（重なり）仕様

影でなく「重なり」で表現する:

1. **幾何学パターン** が本文の背面に 40px 回り込む（`margin-left: -72px` ＋ z-index）
2. **IconTile がリングに重なる**、**グラデ塗りタイルは最前面**
3. **カードのオフセットシャドウ**（6px・5%のフラットな影＝積み紙）＋ hover で浮上（translate −3px・影 9px・8%）
4. ガラス面そのものが透過による前後関係を生む（§5）

## 7. モーション仕様

**IntersectionObserver ＋ CSS のみ。ライブラリ・スクロールリスナー不使用。**

| 項目 | 値 |
| --- | --- |
| 出現 | `opacity 0→1` ＋ `translateY(16px)→0`、`.55s ease` |
| Stagger | `d1–d4 = .07/.14/.21/.28s`（カード・記事行など同_group_要素で段差） |
| IO 設定 | `threshold: 0.15`、`rootMargin: '0px 0px -8% 0px'`、発火後 `unobserve` |
| 除外 | `prefers-reduced-motion: reduce` で全無効（即表示） |

実装上の注意:

- **JS有効時のみ隠す**: `<head>` 内のインラインスクリプトで `document.documentElement.classList.add('js')` を付与し、`html.js .reveal { … }` に隠しスタイルを書く。JS無効・クローラーでは全表示（mockup は簡略化のため未対応）
- 1度出現させた要素は再隠ししない（unobserve 済み）

## 8. レスポンシブ

| ブレークポイント | 挙動 |
| --- | --- |
| ≤860px | About/カード/概念カードを2カラム→適宜1カラム、Hero を縦積み（幾何学領域は高さ200px・タイル3/弧/十字を間引き・t1/t2 再配置）、Header を縦積み・nav 折返し、タイプ見本・USAGE を1カラム |
| ≤560px | 全グリッド1カラム、余白縮小（sheet 14px / site 18px）、記事行を2行組（`64px 1fr`、日付は2行目） |

## 9. アクセシビリティ

- `--ink` / `--ink-2` は paper 上で十分なコントラスト。**`--ink-3` は装飾・メタ専用**とし、意味情報（日付・出典など判断に必要なもの）は `--ink-2` 以上を使う
- `:focus-visible`: `outline: 2px solid var(--ink); outline-offset: 2px`（全インタラクティブ要素、デフォルトoutline置き換え）
- ガラス面の文字は透過率を保ちつつ上記コントラスト規約を守る（カード本文は `--ink-2` 使用）
- `prefers-reduced-motion` / `prefers-reduced-transparency` 両対応（§5 §7）
- 縦書き・SVGアイコンは `aria-hidden="true"`、IconTile に意味を持たせる場合は `role="img"` ＋ `aria-label`

## 10. Astro 実装マッピング

### トークンとスタイル

- `src/styles/global.css` に `:root` トークン（§2.1 の変数名をそのまま使用。mockup と実装で同名）
- `@fontsource/*` で自己ホスト（font-display: swap）:

```
@fontsource/shippori-mincho-b1@600
@fontsource/zen-kaku-gothic-new@400,500
@fontsource/jetbrains-mono@400,500
@fontsource/space-grotesk@600
```

### コンポーネント対応表

| mockup クラス | Astro コンポーネント | 備考 |
| --- | --- | --- |
| `.site-header` | `src/components/Header.astro` | カレント判定は `Astro.url.pathname` |
| `.hero` / `.hero-inner` | `src/components/Hero.astro` | タグライン・リンク先は props |
| `.hero-geo` / `.geo-tile` | `src/components/GeoField.astro` / `IconTile.astro` | SVGはコンポーネント内蔵 |
| `.sec-head` | `src/components/SectionHead.astro` | props: `title` |
| `.note` / `.meta-row` | global.css のユーティリティ / `ProfileMeta.astro` | |
| `.card` | `src/components/ProjectCard.astro` | Content Collection の entry を受ける |
| `.art-row` / `.badge` | `src/components/ArticleRow.astro` / `Badge.astro` | `articles.json`（fetch スクリプト生成）を受ける |
| `.link` / `.btn` | global.css クラス | |
| `.site-footer` | `src/components/Footer.astro` | |
| `.reveal` | `src/scripts/reveal.ts` を `BaseLayout.astro` で読み込み | §7 の `html.js` ゲーティング付き |

### ページ適用

- `index.astro` = Hero + About + Works（上位3件）+ Articles（上位5件）+ Footer
- `about.astro` / `projects/[...slug].astro` / `articles.astro` も同一コンポーネントで構成
- OGP 画像（1200×630）はヒーローのタイポ＋幾何学で後日作成（TODO）

## 11. 決定の記録

| 決定 | 内容 |
| --- | --- |
| 採用: グラデーション C | 藍→朱（#4353C9→#E0644F）。A（藍→シアン）・B（graphite→藍）は候補として mockup に記録 |
| 不採用: ダークモード | ライト（紙）のみ。同一トークンで墨色反転が可能な設計は mockup に参考記録 |
| 採用: 明朝見出し×ゴシック本文 | タイポ方向。オールゴシック案・逆転案は不採用 |
| 採用: ガラス | ヘッダー/幾何タイル/カードの3箇所のみ。全面ガラス化はしない |
| 技術: アニメーション | IntersectionObserver＋CSS のみ（JS 約15行）。ライブラリ不使用 |

## 12. 参照

- モックアップ（動く一次資料）: [mockup.html](./mockup.html) / [mockup-preview.png](./mockup-preview.png)
- 技術構成: [../architecture.md](../architecture.md)
