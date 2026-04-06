import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/Detail.css";

function Detail() {
  const { id } = useParams(); // URL에서 id 가져오기
  const [board, setBoard] = useState(null);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const fetchComments = () => {
    fetch(`https://ani-5.onrender.com/api/comment/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setComments(data));
  };

  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  useEffect(() => {
    // 게시글 가져오기
    fetch(`https://ani-5.onrender.com/api/board/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setBoard(data));

    // 현재 로그인 유저 가져오기
    fetch("https://ani-5.onrender.com/api/user/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.username))
      .catch(() => setCurrentUser(null)); // 로그인 안된 경우

    fetchComments();
  }, [id]);

  const handleDelete = async () => {
    await fetch(`https://ani-5.onrender.com/api/board/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    navigate("/board"); // 삭제 후 목록으로
  };

  const handleCommentSubmit = async () => {
    if (!content.trim()) return;

    await fetch(`https://ani-5.onrender.com/api/comment/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ content }),
    });

    setContent("");
    fetchComments(); // 새로고침
  };

  const handleCommentDelete = async (commentId) => {
    await fetch(`https://ani-5.onrender.com/api/comment/${commentId}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchComments();
  };

  const handleEditSubmit = async (commentId) => {
    if (!editContent.trim()) return;

    await fetch(`https://ani-5.onrender.com/api/comment/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ content: editContent }),
    });

    setEditingId(null);
    setEditContent("");
    fetchComments();
  };

  if (!board) return <div>로딩중...</div>;

  const isAuthor = currentUser === board.user.username;

  return (
    <div className="board-detail">
      <h1>{board.title}</h1>

      <div className="board-meta">작성자: {board.user.username}</div>

      <div className="board-content">{board.content}</div>

      <div className="board-actions">
        {isAuthor && (
          <>
            <button
              className="edit-btn"
              onClick={() => navigate(`/board/edit/${id}`)}
            >
              수정
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              삭제
            </button>
          </>
        )}

        <button className="list-btn" onClick={() => navigate("/board")}>
          목록으로
        </button>
      </div>

      <hr />

      {/* 댓글 */}
      <div className="comment-section">
        <h3>댓글</h3>

        {comments.map((c) => (
          <div key={c.id} className="comment-card">
            <b>{c.username}</b>

            {editingId === c.id ? (
              <>
                <input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button onClick={() => handleEditSubmit(c.id)}>저장</button>
                <button onClick={() => setEditingId(null)}>취소</button>
              </>
            ) : (
              <>
                <span> {c.content}</span>

                {currentUser === c.username && (
                  <>
                    <button onClick={() => startEdit(c)}>수정</button>
                    <button onClick={() => handleCommentDelete(c.id)}>
                      삭제
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        ))}

        <div className="comment-input">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글 입력"
          />
          <button onClick={handleCommentSubmit}>작성</button>
        </div>
      </div>
    </div>
  );
}

export default Detail;
