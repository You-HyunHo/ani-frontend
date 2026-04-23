import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css"; // 기존 Home 스타일을 사용하거나 별도의 CSS를 만드세요

export default function RecommendationPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false); // 🔥 MyPage 방식처럼 중복 실행 방지
  const navigate = useNavigate();

  useEffect(() => {
    // 이미 데이터를 가져왔다면 다시 실행하지 않음
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchRecommendations = async () => {
      try {
        // ✅ userId를 넣지 않고 /me 경로로 요청 (세션 쿠키가 자동으로 포함됨)
        const res = await fetch("https://ani-5.onrender.com/api/recommendations/me", {
          credentials: "include", // 세션 인증을 위해 필수
        });

        if (res.status === 401) {
          alert("로그인이 세션이 만료되었습니다. 다시 로그인해주세요.");
          navigate("/login");
          return;
        }

        if (!res.ok) throw new Error("추천 데이터를 불러오는데 실패했습니다.");

        const data = await res.json();
        console.log("서버에서 온 실제 데이터:", data);
        setRecommendations(data);
      } catch (e) {
        console.error("추천 로직 오류:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [navigate]);

  return (
    <div className="home-container"> {/* 기존 레이아웃 유지 */}
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>
        ✨ 당신을 위한 맞춤 추천 리스트
      </h1>

      {loading ? (
        <p style={{ textAlign: "center" }}>취향 분석 중입니다... 잠시만 기다려주세요!</p>
      ) : recommendations.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <p>아직 추천할 데이터가 부족합니다.</p>
          <p>애니메이션 검색 페이지에서 평점을 더 남겨보세요!</p>
        </div>
      ) : (
        <div className="anime-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
          gap: '20px', 
          padding: '20px' 
        }}>
          {recommendations.map((anime) => (
            <div 
              key={anime.malId} 
              className="anime-card" 
              style={{ cursor: 'pointer', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' }}
              onClick={() => navigate(`/anime/${anime.malId}`)}
            >
              <img 
                src={anime.imageUrl} 
                alt={anime.title} 
                style={{ width: '100%', height: '250px', objectFit: 'cover' }} 
              />
              <div style={{ padding: '10px' }}>
                <p className="anime-title" style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '5px' }}>
                  {anime.title}
                </p>
                <p className="anime-score" style={{ color: '#ff9800' }}>⭐ {anime.score}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <button className="logout-btn" onClick={() => navigate("/")}>
          메인 메뉴로 돌아가기
        </button>
      </div>
    </div>
  );
}