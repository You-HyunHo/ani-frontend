import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AnimeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [anime, setAnime] = useState(null);
  const [rating, setRating] = useState(null);
  const [score, setScore] = useState(1);

  // 🔥 상세 조회
  useEffect(() => {
    const fetchDetail = async () => {
      const res = await fetch(`https://ani-5.onrender.co/api/anime/${id}`);
      const data = await res.json();

      setAnime(data.anime);
      setRating(data.rating);

      if (data.rating) {
        setScore(data.rating.score);
      }
    };

    fetchDetail();
  }, [id]);

  // 🔥 평점 등록
  const handleSubmit = async () => {
    const res = await fetch("https://ani-5.onrender.co/rate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        malId: id,
        score: score,
      }),
    });

    const result = await res.json();

    setRating({ score: result.score }); // 🔥 바로 반영
  };

  if (!anime) return <div>로딩중...</div>;

  return (
    <div>
      <h1>{anime.title || "제목 없음"}</h1>

      {/* 이미지 */}
      {anime.images?.jpg?.image_url ? (
        <img src={anime.images.jpg.image_url} width="200" />
      ) : (
        <p>이미지 없음</p>
      )}

      <p>
        <strong>타입:</strong> {anime.type || "정보 없음"}
      </p>
      <p>
        <strong>방영 여부:</strong> {anime.status || "정보 없음"}
      </p>
      <p>
        <strong>시청 연령:</strong> {anime.rating || "정보 없음"}
      </p>
      <p>
        <strong>평점:</strong> {anime.score || "정보 없음"}
      </p>

      <p>
        <strong>장르:</strong>{" "}
        {anime.genres?.map((g) => g.name).join(", ") || "없음"}
      </p>

      <p>
        <strong>테마:</strong>{" "}
        {anime.themes?.map((t) => t.name).join(", ") || "없음"}
      </p>

      <p>
        <strong>독자층:</strong>{" "}
        {anime.demographics?.map((d) => d.name).join(", ") || "없음"}
      </p>

      {/* 🔥 내 평점 */}
      {rating && <p>내가 매긴 평점: {rating.score}</p>}

      {/* 🔥 평점 선택 */}
      <div>
        <label>평점 (1~10)</label>

        <select value={score} onChange={(e) => setScore(e.target.value)}>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>

        <button onClick={handleSubmit}>평점 등록</button>
      </div>

      <br />

      <button onClick={() => navigate(-1)}>뒤로가기</button>
    </div>
  );
}
