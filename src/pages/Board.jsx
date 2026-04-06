import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Board.css";
function Board() {
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
    if (!window.confirm("진짜 삭제하노?")) return;

    const res = await fetch(`https://ani-5.onrender.com/api/board/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.status === 403) {
      const msg = await res.text();
      alert(msg);
      return;
    }

    alert("삭제 완료");
    fetchBoards();
  };

  return (
    <div className="board-container">
      <h1>📌 게시판</h1>

      <div className="board-top">
        <div className="board-links">
          <a href="board/write">글쓰기</a>
          <a href="home">메인으로</a>
        </div>

        <button
          className="logout-btn"
          onClick={async () => {
            await fetch("https://ani-5.onrender.com/logout", {
              method: "POST",
              credentials: "include",
            });
            window.location.href = "/login";
          }}
        >
          로그아웃
        </button>
      </div>

      <table className="board-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>삭제</th>
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
                    삭제
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
