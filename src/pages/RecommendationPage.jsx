import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";
import { useTranslation } from "react-i18next";

export default function RecommendationPage() {
  const { t } = useTranslation("recommendation");

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchRecommendations = async () => {
      try {
        const res = await fetch(
          "https://ani-5.onrender.com/api/recommendations/me",
          {
            credentials: "include",
          }
        );

        if (res.status === 401) {
          alert(t("sessionExpired"));
          navigate("/login");
          return;
        }

        if (!res.ok) throw new Error();

        const data = await res.json();
        setRecommendations(data);
      } catch (e) {
        console.error("추천 로직 오류:", e);
        alert(t("error"));
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [navigate, t]);

  return (
    <div className="home-container">
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>✨ {t("title")}</h1>

      {loading ? (
        <p style={{ textAlign: "center" }}>{t("loading")}</p>
      ) : recommendations.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <p>{t("empty1")}</p>
          <p>{t("empty2")}</p>
        </div>
      ) : (
        <div
          className="anime-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "20px",
            padding: "20px",
          }}
        >
          {recommendations.map((anime) => (
            <div
              key={anime.malId}
              className="anime-card"
              style={{
                cursor: "pointer",
                border: "1px solid #eee",
                borderRadius: "10px",
                overflow: "hidden",
              }}
              onClick={() => navigate(`/anime/${anime.malId}`)}
            >
              <img
                src={anime.imageUrl}
                alt={anime.title}
                style={{ width: "100%", height: "250px", objectFit: "cover" }}
              />
              <div style={{ padding: "10px" }}>
                <p
                  className="anime-title"
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    marginBottom: "5px",
                  }}
                >
                  {anime.title}
                </p>
                <p className="anime-score" style={{ color: "#ff9800" }}>
                  ⭐ {anime.score} {t("score")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
      >
        <button className="logout-btn" onClick={() => navigate("/home")}>
          {t("backHome")}
        </button>
      </div>
    </div>
  );
}
