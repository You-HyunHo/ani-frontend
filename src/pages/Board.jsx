import { useEffect, useState } from "react";

function Board() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    fetch("https://ani-5.onrender.com/api/board", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setBoards(data));
  }, []);

  const handleDelete = async (id) => {
    await fetch(`https://ani-5.onrender.com/api/board/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setBoards(boards.filter((b) => b.id !== id));
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
                <a href={`/board/${board.id}`}>{board.title}</a>
              </td>
              <td>{board.user.username}</td>
              <td>
                <button onClick={() => handleDelete(board.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Board;
