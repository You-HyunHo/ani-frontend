# AniReco


- 목적 : 애니 정보 제공 및 추천 커뮤니티
- 개발기간 : 26.03.12 ~ 26.04.30
- [배포 링크](https://ani-frontend-ek9a.onrender.com/)
- [backend git hub링크](https://github.com/rlarbtns5898-design/ani)

## 목차

- [ 팀 구성원 및 업무 분담](#팀-구성원-및-업무-분담)
- [DB 모델링](#db-모델링)
- [시퀀스 다이어그램](#시퀀스-다이어그램)
- [트러블 슈팅 및 해결](#트러블-슈팅-및-해결)
- [핵심 기능](#핵심-기능)


## 팀구성원 및 업무 분담

#### 김규순

#### 유현호

## DB 모델링

-![ERD](./README_img/ERD.png)

## 시퀀스 다이어 그램

-[sequence](./README_img/SEQUENCE.md)

## 트러블 슈팅 및 해결

## 핵심 기능

```mermaid
sequenceDiagram
    autonumber
    participant FE as Frontend 
    participant BE as Backend 
    participant DB 

    FE->>BE: 백엔드 요청
    
    Note over BE: [1단계: 내 취향 데이터 분석]
    BE->>BE: extractGenresByScore() 실행<br/>(선호 및 비선호 장르 분류)

    Note over BE: [2단계: 후보군 추출]
    BE->>DB: findHybridCandidateUserIds 호출
    DB-->>BE: 애니/장르가 겹치는 후보 유저 리스트 반환

    Note over BE: [3단계: 통계 데이터 준비]
    BE->>DB: findAllAnimeUsageCounts() 호출
    DB-->>BE: IDF 계산을 위한 애니메이션 통계 데이터 반환

    Note over BE: [4단계: 유저별 유사도 스코어링]
    loop 후보 유저 리스트 순회
        rect rgb(240, 240, 240)
            BE->>BE: workScore (작품 유사도) 계산
            BE->>BE: genreScore (장르 친밀도) 계산
            BE->>BE: penalty (비선호 장르 감점) 계산
            BE->>BE: UserScore 객체 생성 및 최종 점수 합산
        end
    end

    Note over BE: [5단계: 최종 추천 목록 생성]
    BE->>BE: UserScore 기준 내림차순 정렬 및 상위 30명 선정
    BE->>DB: findRecommendedAnimeIds 호출 (미시청작 추출)
    DB-->>BE: 추천 애니메이션 ID 리스트 반환
    
    opt 탐험 로직 (Exploration)
        BE->>DB: findHiddenGemsByGenre() 호출
    end

    BE-->>FE: 최종 추천 리스트 10건 응답
```

