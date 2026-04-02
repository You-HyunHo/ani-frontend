import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AnimeSearch.css";

export default function AnimeSearch() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [minScore, setMinScore] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [genres, setGenres] = useState([]);

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

      {/* 🎭 장르 */}
      <h3>장르</h3>
      <div className="checkbox-group">
        <label>
          <input type="checkbox" onChange={() => handleGenreChange("1")} /> 액션
        </label>
        <label>
          <input type="checkbox" onChange={() => handleGenreChange("2")} /> 모험
        </label>
        <label>
          <input type="checkbox" onChange={() => handleGenreChange("4")} />{" "}
          코미디
        </label>
        <label>
          <input type="checkbox" onChange={() => handleGenreChange("8")} />{" "}
          드라마
        </label>
        <label>
          <input type="checkbox" onChange={() => handleGenreChange("22")} />{" "}
          로맨스
        </label>
      </div>

      <h3>테마</h3>
      <div className="checkbox-group">
        <label>
          <input type="checkbox" onChange={() => handleGenreChange("62")} />
          이세계
        </label>

        <label>
          <input type="checkbox" onChange={() => handleGenreChange("23")} />
          학원물
        </label>

        <label>
          <input type="checkbox" onChange={() => handleGenreChange("40")} />
          심리
        </label>
      </div>

      <h3>독자층</h3>
      <div className="checkbox-group">
        <label>
          <input type="checkbox" onChange={() => handleGenreChange("27")} />
          소년
        </label>

        <label>
          <input type="checkbox" onChange={() => handleGenreChange("25")} />
          소녀
        </label>
      </div>

      <hr />

      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
