import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

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
