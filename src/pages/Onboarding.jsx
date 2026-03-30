import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const [animeList, setAnimeList] = useState([]);
  const [watched, setWatched] = useState([]);
  const [scores, setScores] = useState({});
  const navigate = useNavigate();

  // 🔥 데이터 가져오기
  useEffect(() => {
    fetch("https://ani-5.onrender.com/api/onboarding", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setAnimeList);
  }, []);

  // 🔥 봤어요 체크
  const handleWatched = (malId) => {
    if (watched.includes(malId)) {
      setWatched(watched.filter((id) => id !== malId));
    } else {
      setWatched([...watched, malId]);
    }
  };

  // 🔥 점수 변경
  const handleScore = (malId, value) => {
    setScores({
      ...scores,
      [malId]: value,
    });
  };

  // 🔥 저장
  const handleSubmit = async () => {
    await fetch("https://ani-5.onrender.com/api/onboarding/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        malId: animeList.map((a) => a.malId),
        score: animeList.map((a) => scores[a.malId] || 0),
        watched: watched,
      }),
    });

    navigate("/home"); // 홈으로 이동
  };

  return (
    <div>
      <h2>애니메이션 취향 선택</h2>

      {animeList.map((anime) => (
        <div
          key={anime.malId}
          style={{
            marginBottom: "20px",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          {/* 이미지 */}
          <img src={anime.imageUrl} width="150" />

          {/* 제목 */}
          <p>{anime.title}</p>

          {/* 봤어요 */}
          <label>
            <input
              type="checkbox"
              checked={watched.includes(anime.malId)}
              onChange={() => handleWatched(anime.malId)}
            />
            봤어요
          </label>

          {/* 평점 */}
          <select
            value={scores[anime.malId] || 0}
            onChange={(e) => handleScore(anime.malId, Number(e.target.value))}
          >
            <option value="0">선택 안함</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      ))}

      <button onClick={handleSubmit}>저장</button>
    </div>
  );
}
