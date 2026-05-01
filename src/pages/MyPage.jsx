import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MyPage.css";
import { useTranslation } from "react-i18next";

export default function MyPage() {
  const { t } = useTranslation("mypage");

  const [animeList, setAnimeList] = useState([]);
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchMyPage = async () => {
      try {
        const res = await fetch("https://ani-5.onrender.com/api/mypage", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();
        setAnimeList(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchMyPage();
  }, []);

  return (
    <div className="mypage-container">
      <h1>{t("title")}</h1>

      <h2>{t("myAnime")}</h2>

      {animeList.length === 0 ? (
        <p>{t("empty")}</p>
      ) : (
        <div className="anime-grid">
          {animeList.map((anime) => (
            <div
              key={anime.malId}
              className="anime-card"
              onClick={() => navigate(`/anime/${anime.malId}`)}
            >
              <img src={anime.imageUrl} alt={anime.title} />
              <p className="anime-title">{anime.title}</p>
              <p className="anime-score">
                ⭐ {anime.score} {t("score")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
