import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/OnBoarding.css";
import { useTranslation } from "react-i18next";

export default function Onboarding() {
  const { t } = useTranslation("onboarding");

  const [animeList, setAnimeList] = useState(() => {
    const saved = localStorage.getItem("onboardingAnime");
    return saved ? JSON.parse(saved) : [];
  });

  const [watched, setWatched] = useState([]);
  const [scores, setScores] = useState({});
  const navigate = useNavigate();

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

  const handleWatched = (malId) => {
    if (watched.includes(malId)) {
      setWatched(watched.filter((id) => id !== malId));
    } else {
      setWatched([...watched, malId]);
    }
  };

  const handleScore = (malId, value) => {
    setScores({
      ...scores,
      [malId]: value,
    });
  };

  const handleSubmit = async () => {
    for (let anime of animeList) {
      const malId = anime.malId;
      const isWatched = watched.includes(malId);
      const score = scores[malId] || 0;

      if (isWatched && score === 0) {
        alert(t("errorNoScore"));
        return;
      }

      if (!isWatched && score > 0) {
        alert(t("errorNotWatched"));
        return;
      }
    }

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

    alert(t("success"));
    navigate("/home");
  };

  return (
    <div className="preference-container">
      <h2>{t("title")}</h2>

      <div className="anime-select-grid">
        {animeList.map((anime) => (
          <div key={anime.malId} className="anime-select-card">
            <img src={anime.imageUrl} alt={anime.title} />

            <p className="anime-title">{anime.title}</p>

            <div className="anime-actions">
              <label>
                <input
                  type="checkbox"
                  checked={watched.includes(anime.malId)}
                  onChange={() => handleWatched(anime.malId)}
                />
                {t("watched")}
              </label>

              <select
                value={scores[anime.malId] || 0}
                onChange={(e) =>
                  handleScore(anime.malId, Number(e.target.value))
                }
              >
                <option value="0">{t("noSelect")}</option>
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
        {t("save")}
      </button>
    </div>
  );
}
