import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AnimeSearch.css";

export default function AnimeSearch() {
  const GENRE_DATA = [
    {
      title: "장르",
      items: [
        { id: "1", name: "액션" },
        { id: "2", name: "모험" },
        { id: "5", name: "아방가르드" },
        { id: "46", name: "수상작" },
        { id: "4", name: "코미디" },
        { id: "8", name: "드라마" },
        { id: "10", name: "판타지" },
        { id: "47", name: "음식/요리" },
        { id: "14", name: "공포" },
        { id: "7", name: "미스터리" },
        { id: "22", name: "로맨스" },
        { id: "24", name: "SF" },
        { id: "36", name: "일상" },
        { id: "30", name: "스포츠" },
        { id: "37", name: "초자연" },
        { id: "41", name: "서스펜스" },
      ],
    },
    {
      title: "테마",
      items: [
        { id: "50", name: "성인중심" },
        { id: "51", name: "의인화" },
        { id: "52", name: "CGDCT" },
        { id: "53", name: "육아" },
        { id: "54", name: "격투스포츠" },
        { id: "81", name: "여장/남장" },
        { id: "55", name: "불량학생" },
        { id: "39", name: "탐정" },
        { id: "56", name: "교육" },
        { id: "57", name: "개그" },
        { id: "58", name: "고어" },
        { id: "35", name: "하렘" },
        { id: "59", name: "하이리스크 게임" },
        { id: "13", name: "역사" },
        { id: "60", name: "여성 아이돌" },
        { id: "61", name: "남성 아이돌" },
        { id: "62", name: "이세계" },
        { id: "63", name: "힐링" },
        { id: "64", name: "다각관계" },
        { id: "74", name: "관계 유지형 로맨스" },
        { id: "65", name: "TS" },
        { id: "66", name: "마법소녀" },
        { id: "17", name: "무술" },
        { id: "18", name: "메카" },
        { id: "67", name: "의료" },
        { id: "38", name: "군대" },
        { id: "19", name: "음악" },
        { id: "6", name: "신화" },
        { id: "68", name: "조직 범죄" },
        { id: "69", name: "오타쿠 문화" },
        { id: "20", name: "패러디" },
        { id: "70", name: "공연 예술" },
        { id: "71", name: "반려동물" },
        { id: "40", name: "심리" },
        { id: "3", name: "레이싱" },
        { id: "72", name: "환생" },
        { id: "73", name: "역하렘" },
        { id: "21", name: "사무라이" },
        { id: "23", name: "학원" },
        { id: "75", name: "연예계" },
        { id: "29", name: "우주" },
        { id: "11", name: "전략게임" },
        { id: "31", name: "초능력" },
        { id: "76", name: "생존" },
        { id: "77", name: "팀 스포츠" },
        { id: "78", name: "시간여행" },
        { id: "82", name: "도시 판타지" },
        { id: "32", name: "뱀파이어" },
        { id: "79", name: "게임" },
        { id: "83", name: "악영 영애" },
        { id: "80", name: "미술" },
        { id: "48", name: "직장" },
      ],
    },
    {
      title: "독자층",
      items: [
        { id: "43", name: "여성향" },
        { id: "15", name: "어린이" },
        { id: "42", name: "청년" },
        { id: "27", name: "소년" },
        { id: "25", name: "소녀" },
      ],
    },
  ];

  const FLAT_GENRES = GENRE_DATA.flatMap((g) => g.items);

  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [minScore, setMinScore] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [genres, setGenres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchGenre, setSearchGenre] = useState("");

  // 장르 체크 처리
  const handleGenreChange = (value) => {
    if (genres.includes(value)) {
      setGenres(genres.filter((g) => g !== value));
    } else {
      setGenres([...genres, value]);
    }
  };

  // 검색 버튼
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword) params.append("keyword", keyword);
    if (type) params.append("type", type);
    if (status) params.append("status", status);
    if (rating) params.append("rating", rating);
    if (minScore) params.append("minScore", minScore);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    if (genres.length > 0) {
      genres.forEach((g) => params.append("genres", g));
    }

    // 결과 페이지로 이동
    navigate(`/result?${params.toString()}`);
  };

  return (
    <div className="anime-container">
      <h1>애니메이션 검색</h1>

      {/* 🔎 검색어 */}
      <input
        type="text"
        placeholder="애니 제목 입력"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <hr />

      {/* 🎛 필터 */}
      <h3>Filters</h3>

      <div>
        <label>작품 유형:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All</option>
          <option value="tv">TV</option>
          <option value="movie">Movie</option>
          <option value="ova">OVA</option>
          <option value="special">Special</option>
          <option value="ona">ONA</option>
          <option value="music">Music</option>
          <option value="cm">CM</option>
          <option value="pv">PV</option>
          <option value="tv_special">TV Special</option>
        </select>
      </div>

      <div>
        <label>방영 상태:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="airing">방영 중</option>
          <option value="complete">방영 완료</option>
          <option value="upcoming">방영 예정</option>
        </select>
      </div>

      <div>
        <label>연령 등급:</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">All</option>
          <option value="g">전체 이용가 (G)</option>
          <option value="pg">보호자 지도 권장 (PG)</option>
          <option value="pg13">13세 이상 권장 (PG-13)</option>
          <option value="r17">17세 이상 시청가 (R-17)</option>
          <option value="r">성인 이용가 (R)</option>
        </select>
      </div>

      <div>
        <label>최소 평점:</label>
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={minScore}
          onChange={(e) => setMinScore(e.target.value)}
        />
      </div>

      <div>
        <label>방영 시작일:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div>
        <label>방영 종료일:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <hr />

      <h3>장르</h3>

      <button className="genre-button" onClick={() => setIsModalOpen(true)}>
        장르 선택 ({genres.length})
      </button>

      <div className="selected-genres">
        {genres.map((id) => {
          const g = FLAT_GENRES.find((v) => v.id === id);

          return (
            <span key={id} onClick={() => handleGenreChange(id)}>
              #{g?.name} ❌
            </span>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="modal" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>장르 선택</h2>

            {/* 🔍 검색 */}
            <input
              type="text"
              placeholder="장르 검색..."
              value={searchGenre}
              onChange={(e) => setSearchGenre(e.target.value)}
            />

            {/* 🔥 선택된 장르 (상단 고정) */}
            {genres.length > 0 && (
              <div className="selected-top">
                {genres.map((id) => {
                  const g = FLAT_GENRES.find((v) => v.id === id);
                  return (
                    <span key={id} onClick={() => handleGenreChange(id)}>
                      #{g?.name} ❌
                    </span>
                  );
                })}
              </div>
            )}

            {/* 🔥 카테고리별 출력 */}
            <div className="genre-list">
              {GENRE_DATA.map((section) => (
                <div key={section.title}>
                  <h4>{section.title}</h4>

                  <div className="genre-section">
                    {section.items
                      .filter((g) => g.name.includes(searchGenre))
                      .map((g) => (
                        <label key={g.id}>
                          <input
                            type="checkbox"
                            checked={genres.includes(g.id)}
                            onChange={() => handleGenreChange(g.id)}
                          />
                          {g.name}
                        </label>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 버튼 */}
            <div className="modal-buttons">
              <button onClick={() => setGenres([])}>전체 해제</button>
              <button onClick={() => setIsModalOpen(false)}>완료</button>
            </div>
          </div>
        </div>
      )}

      <hr />

      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
