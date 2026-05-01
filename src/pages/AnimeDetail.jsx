import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/AnimeDetail.css";
import { useTranslation } from "react-i18next";

export default function AnimeDetail() {
  const { t } = useTranslation("animedetail");
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
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        malId: id,
        score: score,
      }),
    });

    const result = await res.json();
    setRating({ score: result.score });
  };

  const handleReviewSubmit = async () => {
    if (!content.trim()) return;

    await fetch(`https://ani-5.onrender.com/api/review/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content: editContent }),
    });

    setEditingId(null);
    setEditContent("");
    fetchReviews();
  };

  if (!anime) return <div>{t("loading")}</div>;

  // 🔥 장르 번역 함수
  const translateGenre = (name) => t(name?.toLowerCase().replace(/ /g, "_"));

  return (
    <div className="detail-container">
      <h1>{anime.title || t("no_title")}</h1>

      <div className="detail-top">
        {anime.images?.jpg?.image_url ? (
          <img src={anime.images.jpg.image_url} alt={anime.title} />
        ) : (
          <p>{t("no_image")}</p>
        )}

        <div className="detail-info">
          <p>
            <strong>{t("type")}:</strong> {anime.type || t("no_info")}
          </p>
          <p>
            <strong>{t("status")}:</strong> {anime.status || t("no_info")}
          </p>
          <p>
            <strong>{t("rating")}:</strong> {anime.rating || t("no_info")}
          </p>
          <p>
            <strong>{t("score")}:</strong> ⭐ {anime.score || t("no_info")}
          </p>

          <p>
            <strong>{t("genre")}:</strong>{" "}
            {anime.genres?.map((g) => translateGenre(g.name)).join(", ")}
          </p>
          <p>
            <strong>{t("theme")}:</strong>{" "}
            {anime.themes?.map((t2) => translateGenre(t2.name)).join(", ")}
          </p>
          <p>
            <strong>{t("demographic")}:</strong>{" "}
            {anime.demographics?.map((d) => translateGenre(d.name)).join(", ")}
          </p>

          {/* 평점 */}
          <div className="rating-box">
            {rating && (
              <p>
                {t("my_score")}: {rating.score}
              </p>
            )}

            <select value={score} onChange={(e) => setScore(e.target.value)}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>

            <button onClick={handleSubmit}>{t("submit")}</button>
          </div>
        </div>
      </div>

      <button className="back-btn" onClick={() => navigate(-1)}>
        {t("back")}
      </button>

      {/* 리뷰 */}
      <div className="review-section">
        <h3>{t("review")}</h3>

        {reviews.map((r) => (
          <div key={r.id} className="review-card">
            <b>{r.username}</b>:
            {editingId === r.id ? (
              <>
                <input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button onClick={() => handleEditSubmit(r.id)}>
                  {t("save")}
                </button>
                <button onClick={() => setEditingId(null)}>
                  {t("cancel")}
                </button>
              </>
            ) : (
              <>
                <span> {r.content}</span>

                {currentUser === r.username && (
                  <>
                    <button onClick={() => startEdit(r)}>{t("edit")}</button>
                    <button onClick={() => handleReviewDelete(r.id)}>
                      {t("delete")}
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
            placeholder={t("write_review")}
          />
          <button onClick={handleReviewSubmit}>{t("submit")}</button>
        </div>
      </div>
    </div>
  );
}
