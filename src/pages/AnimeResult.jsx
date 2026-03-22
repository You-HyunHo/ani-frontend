import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

export default function AnimeResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // 🔥 API 호출
  const fetchData = async () => {
    const query = searchParams.toString();

    const res = await fetch(
      `https://ani-5.onrender.com/api/anime/search?${query}`
    );

    const result = await res.json();

    setData(result.data);
    setStartPage(result.startPage);
    setEndPage(result.endPage);
    setCurrentPage(result.currentPage);
    setLastPage(result.lastPage);
  };

  useEffect(() => {
    const load = async () => {
      await fetchData();
    };
    load();
  }, [searchParams]);

  // 🔥 페이지 이동
  const changePage = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    navigate(`/result?${params.toString()}`);
  };

  return (
    <div>
      <h1>검색 결과</h1>

      {/* 🎬 리스트 */}
      {data.map((anime) => (
        <div key={anime.mal_id}>
          <Link to={`/anime/${anime.mal_id}`}>
            <h2>{anime.title}</h2>
            <img src={anime.images.jpg.image_url} width="150" />
          </Link>

          <p>
            <strong>장르:</strong> {anime.genres.map((g) => g.name).join(", ")}
          </p>

          <p>평점: {anime.score}</p>
          <hr />
        </div>
      ))}

      {/* 🔥 페이징 */}
      <div>
        {/* 처음 */}
        {startPage > 1 && (
          <>
            <button onClick={() => changePage(1)}>1</button>
            {startPage > 2 && <span> ... </span>}
          </>
        )}

        {/* 중간 */}
        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((i) =>
          i === currentPage ? (
            <strong key={i}>{i}</strong>
          ) : (
            <button key={i} onClick={() => changePage(i)}>
              {i}
            </button>
          )
        )}

        {/* 마지막 */}
        {endPage < lastPage && (
          <>
            {endPage < lastPage - 1 && <span> ... </span>}
            <button onClick={() => changePage(lastPage)}>{lastPage}</button>
          </>
        )}
      </div>
    </div>
  );
}
