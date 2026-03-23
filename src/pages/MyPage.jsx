import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const [animeList, setAnimeList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyPage = async () => {
      try {
        const res = await fetch("https://ani-5.onrender.com/api/mypage", {
          credentials: "include",
        });

        if (!res.ok) return;

        const data = await res.json();

        if (data.length > 0) {
          setAnimeList(data); // 🔥 빈 배열이면 덮어쓰지 않음
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchMyPage();
  }, []);

  return (
    <div>
      <h1>마이페이지</h1>

      <h2>내가 평가한 애니</h2>

      {animeList.length === 0 ? (
        <p>평가한 애니가 없습니다.</p>
      ) : (
        animeList.map((anime) => (
          <div key={anime.malId}>
            {/* 🔥 클릭 시 상세 이동 */}
            <div
              onClick={() => navigate(`/anime/${anime.malId}`)}
              style={{ cursor: "pointer" }}
            >
              <img src={anime.imageUrl} width="120" />
              <p>{anime.title}</p>
            </div>

            <p>내가 준 평점: {anime.score}</p>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}
