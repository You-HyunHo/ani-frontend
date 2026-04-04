import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/OnBoarding.css";

export default function Onboarding() {
  const [animeList, setAnimeList] = useState(() => {
    const saved = localStorage.getItem("onboardingAnime");
    return saved ? JSON.parse(saved) : [];
  });
  const [watched, setWatched] = useState([]);
  const [scores, setScores] = useState({});
  const navigate = useNavigate();

  // 🔥 데이터 가져오기
  useEffect(() => {
    if (animeList.length === 0) {
      fetch("https://ani-5.onrender.com/api/onboarding", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setAnimeList(data);
          localStorage.setItem("onboardingAnime", JSON.stringify(data));
        });
    }
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
    for (let anime of animeList) {
      const malId = anime.malId;
      const isWatched = watched.includes(malId);
      const score = scores[malId] || 0;

      // ❌ 봤는데 점수 없음
      if (isWatched && score === 0) {
        alert("평점을 선택해주세요.");
        return;
      }

      // ❌ 점수 있는데 안 봄
      if (!isWatched && score > 0) {
        alert("'봤어요'를 체크해주세요.");
        return;
      }
    }

    // ✅ 통과하면 저장
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

    localStorage.removeItem("onboardingAnime");

    navigate("/home");
  };

  return (
    <div className="preference-container">
      <h2>애니메이션 취향 선택</h2>

      <div className="anime-select-grid">
        {animeList.map((anime) => (
          <div key={anime.malId} className="anime-select-card">
            <img src={anime.imageUrl} />

            <p className="anime-title">{anime.title}</p>

            <div className="anime-actions">
              <label>
                <input
                  type="checkbox"
                  checked={watched.includes(anime.malId)}
                  onChange={() => handleWatched(anime.malId)}
                />
                봤어요
              </label>

              <select
                value={scores[anime.malId] || 0}
                onChange={(e) =>
                  handleScore(anime.malId, Number(e.target.value))
                }
              >
                <option value="0">선택 안함</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <button className="save-btn" onClick={handleSubmit}>
        저장
      </button>
    </div>
  );
}
