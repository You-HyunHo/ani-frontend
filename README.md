# AniReco


- 目的：アニメ情報の提供および推薦コミュニティ
- 開発期間：2026.03.12 ～ 2026.04.30
- [デプロイリンク](https://ani-frontend-ek9a.onrender.com/)
- [バックエンド GitHub リンク](https://github.com/rlarbtns5898-design/ani)

## 目次

- [チーム構成および担当業務](#チーム構成および担当業務)
- [DBモデリング](#DBモデリング)
- [シーケンスダイアグラム](#シーケンスダイアグラム)
- [トラブルシューティングおよび解決](#トラブルシューティングおよび解決)
- [主要機能](#主要機能)

## チーム構成および担当業務

#### キム・ギュスン

#### ユ・ヒョンホ

## DBモデリング

-![ERD](./README_img/ERD.png)

## シーケンスダイアグラム

-[sequence](./README_img/SEQUENCE.md)

## トラブルシューティングおよび解決

## 主要機能

```mermaid
sequenceDiagram
    autonumber
    participant FE as Frontend 
    participant BE as Backend 
    participant DB 

    FE->>BE: バックエンドへリクエスト
    
    Note over BE: [ステップ1：ユーザー嗜好データ分析]
    BE->>BE: extractGenresByScore() 実行<br/>（好み／非好みジャンルを分類）

    Note over BE: [ステップ2：候補ユーザー抽出]
    BE->>DB: findHybridCandidateUserIds 呼び出し
    DB-->>BE: アニメ／ジャンルが類似する候補ユーザー一覧を返却

    Note over BE: [ステップ3：統計データ準備]
    BE->>DB: findAllAnimeUsageCounts() 呼び出し
    DB-->>BE: IDF計算用のアニメ統計データを返却

    Note over BE: [ステップ4：ユーザー別類似度スコアリング]
    loop 候補ユーザー一覧をループ
        rect rgb(240, 240, 240)
            BE->>BE: workScore（作品類似度）を計算
            BE->>BE: genreScore（ジャンル親和度）を計算
            BE->>BE: penalty（非好みジャンルの減点）を計算
            BE->>BE: UserScoreオブジェクト生成および総合スコア算出
        end
    end

    Note over BE: [ステップ5：最終推薦リスト生成]
    BE->>BE: UserScore基準で降順ソートし、上位30名を選定
    BE->>DB: findRecommendedAnimeIds 呼び出し（未視聴作品を抽出）
    DB-->>BE: 推薦アニメIDリストを返却
    
    opt 探索ロジック（Exploration）
        BE->>DB: findHiddenGemsByGenre() 呼び出し
    end

    BE-->>FE: 最終推薦リスト10件を返却
```

