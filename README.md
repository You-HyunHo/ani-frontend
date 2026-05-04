# AniReco


- 目的：アニメ情報の提供および推薦コミュニティ
- 開発期間：2026.03.12 ～ 2026.04.30
- [デプロイリンク](https://ani-frontend-ek9a.onrender.com/)
- [バックエンド GitHub リンク](https://github.com/rlarbtns5898-design/ani)

## 目次

- [技術スタック](#技術スタック)
- [チーム構成および担当業務](#チーム構成および担当業務)
- [DBモデリング](#DBモデリング)
- [シーケンスダイアグラム](#シーケンスダイアグラム)
- [トラブルシューティングおよび解決](#トラブルシューティングおよび解決)
- [主要機能](#主要機能)

## 技術スタック

### Frontend
- React 19.2.4
- JavaScript 
- CSS3

### Backend
- Spring Boot 3.2.5
- Java 17

### Database
- RenderDB

### API
- Jikan API

### Tools
- Render
- Git / GitHub

## チーム構成および担当業務

#### キム・ギュスン

#### ユ・ヒョンホ

## DBモデリング

-![ERD](./README_img/ERD.png)

## シーケンスダイアグラム

-[sequence](./README_img/SEQUENCE.md)

## トラブルシューティングおよび解決
### 1. 推薦リストの一般化（人気作への偏り）問題の解決
-【問題点】

初期の推薦ロジックでは、単純な「ジャンル一致」と「共通視聴数」のみを計算していたため、『ONE PIECE』や『進撃の巨人』といった圧倒的多数が視聴しているメジャーな作品ばかりが推薦される現象が発生しました。これにより、ユーザー固有の細かな好みが反映されず、パーソナライズされた結果が出でなく推薦の質が低下する問題がありました。

-【原因分析】

多くのユーザーが視聴している作品は、統計的に「偶然の一致」が発生しやすく、それが計算上のスコアを押し上げてしまうためです。

-【解決策：IDF (逆文書頻度) の導入】

自然言語処理などで用いられるIDF(Inverse Document Frequency)の概念を推薦アルゴリズムに導入しました。

ロジック: 全ユーザーの視聴データに基づき、視聴数が多い作品の重みを下げ、逆に視聴数が少ない希少な作品（ニッチな名作）が一致した場合のスコア(WorkScore)を高く設定しました。

* **数式**:

$$ 
IDF(i) = \log \left( \frac{N + 1}{df(i) + 1} \right) + 1.0 
$$

【結果】メジャー作品に埋もれていた「ユーザーの真の好みに近い作品」が上位に表示されるようになり、推薦の多様性と的中率を大幅に向上させることができました。

### 2. Jikan API フィルター適用エラーの解決

-【問題点】

アニメ検索機能の実装時、ジャンル・テーマ・対象（デモグラフィック）をそれぞれ別々にリクエストしていましたが、フィルターが正しく適用されず、期待した検索結果が取得できませんでした。

-【原因分析】

Jikan APIでは、ジャンル・テーマ・対象を個別のパラメータではなく、一つの genres パラメータとしてまとめて送る必要がありましたが、それを誤って理解していました。

-【解決策：パラメータの統一】

公式ドキュメントと実際のレスポンス構造を再確認し、各IDを一つの配列としてまとめ、genres パラメータ（例：genres=1,2,3）で送信するように修正しました。

-【結果】

フィルターが正常に動作するようになり、ユーザーの条件に合った検索結果の精度が向上しました。


## 主要機能

```mermaid
sequenceDiagram
    autonumber
    participant FE as Frontend 
    participant BE as Backend 
    participant DB as DB
    FE->>BE: 推薦リスト要請
    
    Note over BE: [Step 1: ユーザー好き嫌い分析]
    BE->>BE: extractGenresByScore() 実行<br/>(好/不好 ジャンル分類)

    Note over BE: [Step 2: 候補群の抽出]
    BE->>DB: findHybridCandidateUserIds 呼出
    DB-->>BE: 類似傾向を持つユーザーリスト返却

    Note over BE: [Step 3: 統計データの準備]
    BE->>DB: findAllAnimeUsageCounts() 呼出
    DB-->>BE: IDF計算用の統計データ返却

    Note over BE: [Step 4: ユーザー別類似度スコアリング]
    loop 候補ユーザーリストの巡回
        rect rgb(240, 240, 240)
            BE->>BE: WorkScore (作品類似度) 計算
            BE->>BE: GenreScore (ジャンル親密度) 計算
            BE->>BE: Penalty (非選好ジャンル減点) 計算
            BE->>BE: 最終スコアの合算
        end
    end

    Note over BE: [Step 5: 最終推薦リストの生成]
    BE->>BE: スコア順にソート、上位30名を選定
    BE->>DB: findRecommendedAnimeIds 呼出 (未視聴作品の抽出)
    DB-->>BE: 推薦アニメIDリスト返却
    
    opt 探索ロジック (Exploration)
        BE->>DB: findHiddenGemsByGenre() 呼출
    end

    BE-->>FE: 最終推薦リスト(10件)をレスポンス
```

### 推薦アルゴリズムの詳細 (Recommendation Logic)


#### Step 1: ユーザー分析

ユーザーの過去の評価データを分析し、好みのジャンルと非選好ジャンルを自動的に分類します。
extractGenresByScore() を実行し、後続のスコアリング段階において加点および減点を適用するための基準を定義します。
本プロジェクトのコアとなるハイブリッド推薦システムは、以下の3つの主要スコアを合算して算出されます。

#### Step 2: 候補ユーザー群の抽出 

一次候補群
findHybridCandidateUserIds を用いて候補ユーザーを取得します。
自身と共通の作品を視聴しているユーザーを優先的に500人抽出します。

二次候補群
共通視聴ユーザーが十分に存在しない場合、ユーザーの好みのジャンルを視聴しているユーザーを追加で取得します。

#### Step 3: 統計データの準備 

findAllAnimeUsageCounts() を通じて各作品の出現頻度を把握し、それを基に IDF（逆文書頻度）重みを計算する準備を行います。


#### Step 4: ユーザー類似度スコアリング 

候補ユーザーごとに以下の3つの指標を組み合わせ、最終的な類似度スコアを算出します。

WorkScore（作品類似度）:
IDF重みを適用し、一般的に広く視聴されている人気作品よりも、比較的視聴者数の少ない作品を共有している場合に高いスコアを付与します。 

$$
計算: WorkScore = 10 \cdot \sum IDF(i)
$$

GenreScore（ジャンル親和度）:
ユーザーの好みのジャンルと候補ユーザーの視聴傾向との一致度を評価します。

$$
計算: GenreScore = 5 \cdot \text{avg}(\text{matchcount} \cdot 2.0)
$$

Penalty（非選好ジャンル減点）:
ユーザーが好まないジャンルを主に視聴しているユーザーに対して減点を行い、推薦精度を向上させます。

$$
計算: Penalty = \sum (\text{MatchCount} \cdot 1.5)
$$

$$
最終計算：　TotalScore(u) = WorkScore + GenreScore - Penalty
$$

#### Step 5: 最終推薦リストの生成 (Recommendation Generation)


総合スコア（TotalScore)が高い上位30名のユーザーを「近傍ユーザー」として選定します。

未視聴作品の抽出
findRecommendedAnimeIds を用いて、近傍ユーザーが高く評価している一方で、対象ユーザーが未視聴の作品を抽出します。

探索ロジック（Exploration）:
抽出された作品数が10件未満の場合、findHiddenGemsByGenre() を利用して、ユーザーの好みのジャンルに属する高評価かつ比較的認知度の低い作品（いわゆる隠れた名作）をランダムに追加し、推薦リストを補完します。



