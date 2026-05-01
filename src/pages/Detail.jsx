import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/Detail.css";
import { useTranslation } from "react-i18next";

function Detail() {
  const { t } = useTranslation("detail");
  const { id } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
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
    fetch(`https://ani-5.onrender.com/api/board/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setBoard(data));

    fetch("https://ani-5.onrender.com/api/user/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCurrentUser(data.username))
      .catch(() => setCurrentUser(null));

    fetchComments();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(t("confirmDelete"))) return;

    await fetch(`https://ani-5.onrender.com/api/board/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    alert(t("deleteSuccess"));
    navigate("/board");
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
    fetchComments();
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

  if (!board) return <div>{t("loading")}</div>;

  const isAuthor = currentUser === board.user.username;

  return (
    <div className="board-detail">
      <h1>{board.title}</h1>

      <div className="board-meta">
        {t("author")}: {board.user.username}
      </div>

      <div className="board-content">{board.content}</div>

      <div className="board-actions">
        {isAuthor && (
          <>
            <button
              className="edit-btn"
              onClick={() => navigate(`/board/edit/${id}`)}
            >
              {t("edit")}
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              {t("delete")}
            </button>
          </>
        )}

        <button className="list-btn" onClick={() => navigate("/board")}>
          {t("backToList")}
        </button>
      </div>

      <hr />

      {/* 댓글 */}
      <div className="comment-section">
        <h3>{t("comments")}</h3>

        {comments.map((c) => (
          <div key={c.id} className="comment-card">
            <b>{c.username}</b>

            {editingId === c.id ? (
              <>
                <input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button onClick={() => handleEditSubmit(c.id)}>
                  {t("save")}
                </button>
                <button onClick={() => setEditingId(null)}>
                  {t("cancel")}
                </button>
              </>
            ) : (
              <>
                <span> {c.content}</span>

                {currentUser === c.username && (
                  <>
                    <button onClick={() => startEdit(c)}>{t("edit")}</button>
                    <button onClick={() => handleCommentDelete(c.id)}>
                      {t("delete")}
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
            placeholder={t("commentPlaceholder")}
          />
          <button onClick={handleCommentSubmit}>{t("submit")}</button>
        </div>
      </div>
    </div>
  );
}

export default Detail;
