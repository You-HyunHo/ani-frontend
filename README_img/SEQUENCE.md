# Sequence Diagrams


## ログイン
```mermaid
sequenceDiagram 
participant Frontend
participant Backend
participant DB

   
    Frontend->>Backend: ID/パスワード入力
    Backend->>DB: ユーザー情報の確認
    DB-->>Frontend: ログイン完了
    
```

## 회원가입
```mermaid
sequenceDiagram
    participant FE as Frontend (React)
    participant BE as Backend (Spring)
    participant DB as Database

    FE->>BE: 1. 가입 요청 (ID, PW, 나이, 성별)
    BE->>DB: 2. 중복 확인 및 사용자 저장
    DB-->>BE: 3. 저장 완료
    BE-->>FE: 4. 응답 (200 OK / 성공 메시지)
```

## 로그인완료 후
```mermaid
sequenceDiagram
    participant FE as Frontend 
    participant BE as Backend 
    participant DB 

    FE->>BE: 1. 내 정보 요청 (GET /me)
    BE->>DB: 2. 로그인된 사용자 정보 조회
    DB-->>BE: 3. 유저 데이터 반환
    BE-->>FE: 4. 응답 (username, firstLogin 등)
    Note over FE: firstLogin 값에 따라<br/>온보딩 또는 메인으로 이동
```

## 초기로그인후 평가(onbaording)
```mermaid
sequenceDiagram
    autonumber
    participant FE as Frontend (React)
    participant BE as Backend (Spring)
    participant DB 

    Note over FE, DB: [단계 1] 온보딩 데이터 로드
    FE->>BE: GET /api/onboarding
    BE->>DB: 랜덤 애니메이션 20개 조회
    DB-->>BE: 애니메이션 리스트 반환
    BE-->>FE: 20개 리스트 응답 (malId, title, imageUrl)

    Note over FE, DB: [단계 2] 사용자 평가 및 저장
    FE->>FE: 사용자가 애니메이션 점수 선택
    FE->>BE: POST /api/onboarding/save (평가 데이터)
    
    loop 각 평가 항목 처리
        BE->>DB: 기존 평가 여부 확인 및 점수(AnimeRating) 저장
    end

    Note over FE, DB: [단계 3] 유저 상태 업데이트 및 종료
    BE->>DB: 유저 firstLogin 상태 변경 (true -> false)
    DB-->>BE: 업데이트 완료
    BE-->>FE: { "message": "온보딩 완료" }
    
    Note over FE: 메인 페이지로 리다이렉트
```
## 게시판
```mermaid
sequenceDiagram
    participant FE as Frontend
    participant BE as Backend
    participant DB 

    %% 1. 권한 준비 (버튼 노출 제어)
    FE->>BE: GET /api/user/me (내 정보 확인)
    Note over FE: 작성자 == 내이름 비교 후<br/>삭제 버튼 노출 결정

    %% 2. 삭제 실행
    FE->>BE: DELETE /api/board/{id}
    BE->>DB: 작성자 일치 여부 최종 검증
    
    alt 검증 통과
        BE->>DB: 데이터 삭제
        BE-->>FE: 200 OK (성공)
        Note over FE: 목록 새로고침
    else 검증 실패
        BE-->>FE: 403 Forbidden (실패)
    end
```
## 댓글
```mermaid

    sequenceDiagram
    participant FE as Frontend
    participant BE as Backend
    participant DB 

    %% 1. 조회
    FE->>BE: GET /api/comment/{boardId} (댓글 요청)
    BE->>DB: 해당 글의 댓글들 조회
    DB-->>BE: 데이터 반환
    BE-->>FE: 댓글 목록 응답

    %% 2. 작성
    FE->>BE: POST /api/comment/{boardId} (내용)
    BE->>DB: 유저/게시글 확인 후 댓글 저장
    BE-->>FE: 성공 응답

    %% 3. 수정/삭제 (권한체크 포함)
    FE->>BE: PUT/DELETE /api/comment/{commentId}
    BE->>DB: 작성자 일치 확인 후 수정/삭제
    BE-->>FE: 처리 완료 응답
```

## 검색
```mermaid
sequenceDiagram
    participant FE as Frontend
    participant BE as Backend (AnimeController)
    participant EXT as External API (Jikan)
    participant DB 

    %% 1. 검색 기능
    Note over FE, EXT: [검색] 키워드 및 필터 조건 적용
    FE->>BE: GET /api/anime/search (keyword, type, page 등)
    BE->>BE: UriComponentsBuilder로 쿼리문 동적 생성
    BE->>EXT: GET /v4/anime?q=...&page=...
    EXT-->>BE: 애니메이션 목록 및 페이지 정보 반환
    
    Note over BE: 로직: 현재 페이지 기준<br/>페이지 그룹(Start~End) 계산
    
    BE-->>FE: 검색 결과 + 페이지네이션 정보 응답

    %% 2. 상세 조회
    Note over FE, DB: [상세] 정보 및 내부 평점 결합
    FE->>BE: GET /api/anime/{id}
    par 외부 정보 조회
        BE->>EXT: GET /v4/anime/{id}
        EXT-->>BE: 상세 데이터 반환
    and 내부 평점 조회
        BE->>DB: 해당 애니메이션 평점(Rating) 조회
        DB-->>BE: 평점 데이터 반환
    end
    
    BE-->>FE: 애니메이션 정보 + 평점 통합 응답
```

## 리뷰
```mermaid
sequenceDiagram
    participant FE as Frontend
    participant BE as Backend
    participant DB 
    %% 1. 조회
    FE->>BE: GET /api/review/{malId} (리뷰 요청)
    BE->>DB: 애니메이션 ID로 리뷰 목록 조회
    DB-->>BE: 데이터 반환
    BE-->>FE: 리뷰 목록 응답 (Drafter, Content 등)

    %% 2. 작성
    FE->>BE: POST /api/review/{malId} (리뷰 내용)
    BE->>DB: 유저 정보 확인 및 리뷰 저장
    BE-->>FE: 200 OK

    %% 3. 수정/삭제
    FE->>BE: PUT/DELETE /api/review/{reviewId}
    BE->>DB: 기존 리뷰의 작성자 일치 여부 검증
    
    alt 검증 통과
        BE->>DB: 리뷰 수정 또는 삭제 실행
        BE-->>FE: 처리 완료 응답
    else 검증 실패
        BE-->>FE: 500/RuntimeException (권한 없음)
    end
```

## 평점
```mermaid
sequenceDiagram
    participant FE as Frontend
    participant BE as Backend
    participant DB 

    FE->>BE: POST /rate (malId, score)
    
    Note over BE: SecurityContext에서<br/>현재 로그인 유저 확인
    
    BE->>DB: 해당 유저 & malId로 기존 평점 조회
    
    alt 기존 평점 존재 (Update)
        DB-->>BE: AnimeRating 엔티티 반환
        BE->>BE: 점수(score) 수정
    else 기존 평점 없음 (Create)
        DB-->>BE: 빈 값(Optional.empty) 반환
        BE->>BE: 새 AnimeRating 객체 생성 및 설정
    end
    
    BE->>DB: 최종 평점 데이터 저장 (save)
    BE-->>FE: 200 OK (저장 완료 메시지 & 점수)
```

## 마이페이지
```mermaid
sequenceDiagram
    participant FE as Frontend
    participant BE as Backend 
    participant DB 
    participant EXT as External API (Jikan)

    FE->>BE: GET /api/mypage (요청)
    
    Note over BE: SecurityContext에서<br/>로그인 유저 확인
    
    BE->>DB: 유저가 평점 남긴 목록(malId, score) 조회
    DB-->>BE: List<AnimeRating> 반환

    loop 각 평점 데이터에 대하여 (malId 기준)
        BE->>EXT: GET /v4/anime/{malId} (상세 정보 요청)
        EXT-->>BE: 애니메이션 제목, 이미지 URL 반환
        Note over BE: 내 평점(score) + API 정보 결합 (DTO 생성)
        BE->>BE: API 부하 방지 (Sleep 0.3초)
    end

    BE-->>FE: 결합된 마이페이지 리스트 반환
```
