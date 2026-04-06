import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/MyPage.css";

export default function MyPage() {
  const [animeList, setAnimeList] = useState([]);
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasFetched.current) return; // 🔥 두 번째 실행 막기
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

  console.log(animeList);

  return (
    <div className="mypage-container">
      <h1>마이페이지</h1>

      <h2>내가 평가한 애니</h2>

      {animeList.length === 0 ? (
        <p>평가한 애니가 없습니다.</p>
      ) : (
        <div className="anime-grid">
          {animeList.map((anime) => (
            <div
              key={anime.malId}
              className="anime-card"
              onClick={() => navigate(`/anime/${anime.malId}`)}
            >
              <img src={anime.imageUrl} />
              <p className="anime-title">{anime.title}</p>
              <p className="anime-score">⭐ {anime.score}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
