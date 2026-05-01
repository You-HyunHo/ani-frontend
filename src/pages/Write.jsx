import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Write.css";
import { useTranslation } from "react-i18next";

function Write() {
  const { t } = useTranslation("write");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://ani-5.onrender.com/api/board", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("글 등록 실패 :", text);
        alert(t("errorSubmit"));
        return;
      }

      const data = await res.json();
      console.log("등록 성공", data);
      alert(t("successSubmit"));

      navigate("/board");
    } catch (err) {
      console.error("글 등록 중 오류발생:", err);
      alert(t("serverError"));
    }
  };

  return (
    <div className="write-container">
      <h1>✏ {t("title")}</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>{t("label.title")}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("placeholder.title")}
            required
          />
        </div>

        <div>
          <label>{t("label.content")}</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            placeholder={t("placeholder.content")}
            required
          />
        </div>

        <div className="write-actions">
          <button type="submit" className="submit-btn">
            {t("submit")}
          </button>

          <button
            type="button"
            className="list-btn"
            onClick={() => navigate("/board")}
          >
            {t("backToList")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Write;
