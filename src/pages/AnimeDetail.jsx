import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/AnimeDetail.css";

export default function AnimeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [anime, setAnime] = useState(null);
  const [rating, setRating] = useState(null);
  const [score, setScore] = useState(1);

  const [reviews, setReviews] = useState([]);
  const [content, setContent] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const fetchReviews = () => {
    fetch(`https://ani-5.onrender.com/api/review/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setReviews(data));
  };

  // 🔥 상세 조회
  useEffect(() => {
    const fetchDetail = async () => {
      const res = await fetch(`https://ani-5.onrender.com/api/anime/${id}`);
      const data = await res.json();

      setAnime(data.anime);
      setRating(data.rating);

      if (data.rating) {
        setScore(data.rating.score);
      }
    };

    fetchDetail();

    // 로그인 유저
    fetch("https://ani-5.onrender.com/api/user/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.username))
      .catch(() => setCurrentUser(null));

    fetchReviews();
  }, [id]);

  // 🔥 평점 등록
  const handleSubmit = async () => {
    const res = await fetch("https://ani-5.onrender.com/rate", {
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

  const handleReviewSubmit = async () => {
    if (!content.trim()) return;

    await fetch(`https://ani-5.onrender.com/api/review/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ content }),
    });

    setContent("");
    fetchReviews();
  };

  const handleReviewDelete = async (reviewId) => {
    await fetch(`https://ani-5.onrender.com/api/review/${reviewId}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchReviews();
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setEditContent(r.content);
  };

  const handleEditSubmit = async (reviewId) => {
    if (!editContent.trim()) return;

    await fetch(`https://ani-5.onrender.com/api/review/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ content: editContent }),
    });

    setEditingId(null);
    setEditContent("");
    fetchReviews();
  };

  if (!anime) return <div>로딩중...</div>;

  return (
    <div className="detail-container">
      <h1>{anime.title || "제목 없음"}</h1>

      <div className="detail-top">
        {anime.images?.jpg?.image_url ? (
          <img src={anime.images.jpg.image_url} />
        ) : (
          <p>이미지 없음</p>
        )}

        <div className="detail-info">
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
            <strong>평점:</strong> ⭐ {anime.score || "정보 없음"}
          </p>

          <p>
            <strong>장르:</strong> {anime.genres?.map((g) => g.name).join(", ")}
          </p>
          <p>
            <strong>테마:</strong> {anime.themes?.map((t) => t.name).join(", ")}
          </p>
          <p>
            <strong>독자층:</strong>{" "}
            {anime.demographics?.map((d) => d.name).join(", ")}
          </p>

          {/* 평점 */}
          <div className="rating-box">
            {rating && <p>내 평점: {rating.score}</p>}

            <select value={score} onChange={(e) => setScore(e.target.value)}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>

            <button onClick={handleSubmit}>등록</button>
          </div>
        </div>
      </div>

      <button className="back-btn" onClick={() => navigate(-1)}>
        뒤로가기
      </button>

      {/* 리뷰 */}
      <div className="review-section">
        <h3>리뷰</h3>

        {reviews.map((r) => (
          <div key={r.id} className="review-card">
            <b>{r.username}</b>:
            {editingId === r.id ? (
              <>
                <input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button onClick={() => handleEditSubmit(r.id)}>저장</button>
                <button onClick={() => setEditingId(null)}>취소</button>
              </>
            ) : (
              <>
                <span> {r.content}</span>

                {currentUser === r.username && (
                  <>
                    <button onClick={() => startEdit(r)}>수정</button>
                    <button onClick={() => handleReviewDelete(r.id)}>
                      삭제
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        ))}

        <div className="review-input">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="리뷰 작성"
          />
          <button onClick={handleReviewSubmit}>등록</button>
        </div>
      </div>
    </div>
  );
}
