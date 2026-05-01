import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/Edit.css";
import { useTranslation } from "react-i18next";

function Edit() {
  const { t } = useTranslation("edit");
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch(`https://ani-5.onrender.com/api/board/${id}`, {
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

    await fetch(`https://ani-5.onrender.com/api/board/${id}`, {
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
      <h1>✏ {t("title")}</h1>

      <form onSubmit={handleUpdate}>
        <div>
          {t("label.title")}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("placeholder.title")}
            required
          />
        </div>

        <div>
          {t("label.content")}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("placeholder.content")}
            required
          />
        </div>

        <div className="edit-actions">
          <button type="submit" className="update-btn">
            {t("submit")}
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Edit;
