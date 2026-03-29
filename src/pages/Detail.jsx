import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Detail() {
  const { id } = useParams(); // URL에서 id 가져오기
  const [board, setBoard] = useState(null);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 게시글 가져오기
    fetch(`http://localhost:8080/api/board/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setBoard(data));

    // 현재 로그인 유저 가져오기
    fetch("http://localhost:8080/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.username))
      .catch(() => setCurrentUser(null)); // 로그인 안된 경우
  }, [id]);

  const handleDelete = async () => {
    await fetch(`http://localhost:8080/api/board/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    navigate("/board"); // 삭제 후 목록으로
  };

  if (!board) return <div>로딩중...</div>;

  const isAuthor = currentUser === board.user.username;

  return (
    <div>
      <h1>{board.title}</h1>

      <p>작성자: {board.user.username}</p>

      <hr />

      <div>
        <p>{board.content}</p>
      </div>

      <hr />
      {isAuthor && (
        <>
          <button onClick={() => navigate(`/board/edit/${id}`)}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </>
      )}

      <button onClick={() => navigate("/board")}>목록으로</button>
    </div>
  );
}

export default Detail;
