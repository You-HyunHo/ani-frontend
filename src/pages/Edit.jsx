import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 기존 데이터 불러오기
  useEffect(() => {
    fetch(`ani-5.onrender.com/api/board/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setContent(data.content);
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    await fetch(`ani-5.onrender.com/api/board/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title,
        content,
      }),
    });

    navigate(`/board/${id}`);
  };

  return (
    <div>
      <h1>✏ 글 수정</h1>

      <form onSubmit={handleUpdate}>
        <div>
          제목:
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          내용:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <button type="submit">수정 완료</button>
      </form>

      <button onClick={() => navigate(-1)}>취소</button>
    </div>
  );
}

export default Edit;
