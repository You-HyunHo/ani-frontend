import { useNavigate } from "react-router-dom";
import "./Home.css";
function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("http://localhost:8080/logout", {
      method: "POST",
      credentials: "include",
    });

    alert("로그아웃");
    navigate("/login");
  };

  const handleFetchAll = async () => {
    const res = await fetch("http://localhost:8080/api/fetch-all", {
      credentials: "include",
    });

    const data = await res.json();
    alert(data.message);
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
      <button onClick={handleFetchAll}>애니 DB 채우기</button>
    </div>
  );
}

export default Home;
