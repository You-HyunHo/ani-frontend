import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/Edit.css";

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 기존 데이터 불러오기
  useEffect(() => {
    fetch(` https://ani-5.onrender.com/api/board/${id}`, {
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

    await fetch(` https://ani-5.onrender.com/api/board/${id}`, {
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
    <div className="edit-container">
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

        <div className="edit-actions">
          <button type="submit" className="update-btn">
            수정 완료
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default Edit;
