import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function Board() {
  const [boards, setBoards] = useState([]);
  const [loginUser,setLoginUser] = useState("");

  const fetchBoards = async()=>{
    const res = await fetch("https://ani-5.onrender.com/api/board", {
      credentials: "include",
    });
    const data = await res.json();
    setBoards(data);
  };

  useEffect(() => {
  fetchBoards();

  fetch("https://ani-5.onrender.com/api/user/me", {
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) {
        return null;
      }
      return res.json();
    })
    .then((data) => {
      if (data) {
        setLoginUser(data.username);
      }
    })
    .catch((err) => {
      console.error("유저정보부르기 실패", err);
    });
}, []);

  const handleDelete = async (id) => {
    if(!window.confirm("진짜 삭제하노?")) return;

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
    <div>
      <h1>📌 게시판</h1>

      <a href="board/write">글쓰기</a>

      <button
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

      <hr />

      <table border="1">
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
                {board.user.username===loginUser &&(
                  <button onClick={() => handleDelete(board.id)}>
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
