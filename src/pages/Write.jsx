import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Write() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 기본 제출 막기
    try {
      const res = await fetch("https://ani-5.onrender.co/api/board", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 로그인 유지
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("글 등록 실패 :", text);
        alert("글등록실패 서버확인필요");
        return;
      }

      const data = await res.json();
      console.log("등록 성공", data);
      alert("글 등록 완료!");

      navigate("/board"); // 작성 후 목록으로 이동
    } catch (err) {
      console.error("글 등록 중 오류발생:", err);
      alert("서버와 연결실패");
    }
  };

  return (
    <div>
      <h1>✏ 글쓰기</h1>

      <form onSubmit={handleSubmit}>
        <div>
          제목:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          내용:
          <br />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            cols="40"
            required
          />
        </div>

        <button type="submit">작성</button>
      </form>

      <br />

      <button onClick={() => navigate("/board")}>목록으로</button>
    </div>
  );
}

export default Write;
