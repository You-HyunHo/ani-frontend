import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Board.css";
import { useTranslation } from "react-i18next";

function Board() {
  const { t } = useTranslation("board");
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [loginUser, setLoginUser] = useState("");

  const fetchBoards = async () => {
    const res = await fetch("https://ani-5.onrender.com/api/board", {
      credentials: "include",
    });
    const data = await res.json();
    setBoards(data);
  };

  useEffect(() => {
    const load = async () => {
      await fetchBoards();

      const res = await fetch("https://ani-5.onrender.com/api/user/me", {
        credentials: "include",
      });

      if (!res.ok) return;

      const data = await res.json();
      setLoginUser(data.username);
    };

    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t("confirmDelete"))) return;

    const res = await fetch(`https://ani-5.onrender.com/api/board/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.status === 403) {
      const msg = await res.text();
      alert(msg);
      return;
    }

    alert(t("deleteSuccess"));
    fetchBoards();
  };

  const handleLogout = async () => {
    await fetch("https://ani-5.onrender.com/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  return (
    <div className="board-container">
      <h1>📌 {t("title")}</h1>

      <div className="board-top">
        <div className="board-links">
          <span onClick={() => navigate("/board/write")}>{t("write")}</span>
          <span onClick={() => navigate("/home")}>{t("home")}</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          {t("logout")}
        </button>
      </div>

      <table className="board-table">
        <thead>
          <tr>
            <th>{t("table.id")}</th>
            <th>{t("table.title")}</th>
            <th>{t("table.author")}</th>
            <th>{t("table.delete")}</th>
          </tr>
        </thead>

        <tbody>
          {boards.map((board) => (
            <tr key={board.id}>
              <td>{board.id}</td>

              <td>
                <Link to={`/board/${board.id}`}>{board.title}</Link>
              </td>

              <td>{board.user.username}</td>

              <td>
                {board.user.username === loginUser && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(board.id)}
                  >
                    {t("deleteBtn")}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Board;
