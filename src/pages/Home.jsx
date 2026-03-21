import { useNavigate } from "react-router-dom";

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

  return (
    <div>
      <h1>메인 메뉴</h1>

      <ul>
        <li>
          <a href="/board">게시판</a>
        </li>
        <li>
          <a href="/mypage">마이페이지</a>
        </li>
        <li>
          <a href="/anime">애니메이션검색</a>
        </li>
      </ul>

      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}

export default Home;
