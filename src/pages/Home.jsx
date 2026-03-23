import { useNavigate } from "react-router-dom";
import "./Home.css";
function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("https://ani-5.onrender.co/logout", {
      method: "POST",
      credentials: "include",
    });

    alert("로그아웃");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <h1>메인 메뉴</h1>

      <ul className="menu-list">
        <li>
          <a href="/board">게시판</a>
        </li>
        <li>
          <a href="/mypage">마이페이지</a>
        </li>
        <li>
          <a href="/animesearch">애니메이션검색</a>
        </li>
      </ul>

      <button className="logout-btn" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}

export default Home;
