import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Detail() {
  const { id } = useParams(); // URL에서 id 가져오기
  const [board, setBoard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://ani-5.onrender.co/api/board/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setBoard(data));
  }, [id]);

  const handleDelete = async () => {
    await fetch(`https://ani-5.onrender.co/api/board/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    navigate("/board"); // 삭제 후 목록으로
  };

  if (!board) return <div>로딩중...</div>;

  return (
    <div>
      <h1>{board.title}</h1>

      <p>작성자: {board.user.username}</p>

      <hr />

      <div>
        <p>{board.content}</p>
      </div>

      <hr />
      <button onClick={() => navigate(`/board/edit/${id}`)}>수정</button>

      <button onClick={() => navigate("/board")}>목록으로</button>

      <button onClick={handleDelete}>삭제</button>
    </div>
  );
}

export default Detail;
