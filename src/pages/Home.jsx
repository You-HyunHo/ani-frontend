import { useNavigate } from "react-router-dom";
import "../css/Home.css";
import { useTranslation } from "react-i18next";

function Home() {
  const { t } = useTranslation("home");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("https://ani-5.onrender.com/logout", {
      method: "POST",
      credentials: "include",
    });

    alert(t("logoutAlert"));
    navigate("/login");
  };

  const handleFetchAll = async () => {
    const res = await fetch("https://ani-5.onrender.com/api/fetch-all", {
      credentials: "include",
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="home-container">
      <h1>{t("title")}</h1>

      <ul className="menu-list">
        <li>
          <a href="/board">{t("menu.board")}</a>
        </li>
        <li>
          <a href="/mypage">{t("menu.mypage")}</a>
        </li>
        <li>
          <a href="/animesearch">{t("menu.search")}</a>
        </li>
        <li>
          <a href="/worldcup">{t("menu.worldcup")}</a>
        </li>
        <li>
          <a href="/recommendations">{t("menu.recommend")}</a>
        </li>
      </ul>

      <button className="logout-btn" onClick={handleLogout}>
        {t("logout")}
      </button>

      <button onClick={handleFetchAll}>{t("fillDB")}</button>
    </div>
  );
}

export default Home;
