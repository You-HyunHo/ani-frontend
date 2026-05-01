import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Worldcup.css";
import { useTranslation } from "react-i18next";

export default function Worldcup() {
  const { t } = useTranslation("worldcup");

  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [winners, setWinners] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [roundSize, setRoundSize] = useState(16);
  const [isStarted, setIsStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isStarted) return;

    fetch(`https://ani-5.onrender.com/worldcup?size=${roundSize}`)
      .then((res) => res.json())
      .then((data) => setCandidates(data));
  }, [isStarted, roundSize]);

  const handleSelect = (winner) => {
    if (isSelecting) return;
    setIsSelecting(true);

    const newWinners = [...winners, winner];

    if (currentIndex + 2 >= candidates.length) {
      setTimeout(() => {
        setCandidates(newWinners);
        setWinners([]);
        setCurrentIndex(0);
        setIsSelecting(false);
      }, 200);
    } else {
      setTimeout(() => {
        setWinners(newWinners);
        setCurrentIndex((prev) => prev + 2);
        setIsSelecting(false);
      }, 200);
    }
  };

  // 시작 화면
  if (!isStarted) {
    return (
      <div className="start-overlay">
        <div className="start-box">
          <h2>{t("title")}</h2>

          <select
            value={roundSize}
            onChange={(e) => setRoundSize(Number(e.target.value))}
          >
            <option value={16}>{t("round", { size: 16 })}</option>
            <option value={32}>{t("round", { size: 32 })}</option>
            <option value={64}>{t("round", { size: 64 })}</option>
            <option value={128}>{t("round", { size: 128 })}</option>
            <option value={256}>{t("round", { size: 256 })}</option>
          </select>

          <div className="start-buttons">
            <button onClick={() => setIsStarted(true)}>{t("start")}</button>

            <button onClick={() => navigate("/home")}>{t("home")}</button>
          </div>
        </div>
      </div>
    );
  }

  // 우승 화면
  if (candidates.length === 1) {
    const winner = candidates[0];

    return (
      <div className="winner-container">
        <h1>🏆 {t("winner")}</h1>

        <div className="winner-card">
          <img src={winner.imageUrl} alt={winner.title} />
          <p>{winner.title}</p>
        </div>

        <div className="result-buttons">
          <button
            onClick={() => {
              setIsStarted(false);
              setCandidates([]);
              setCurrentIndex(0);
              setWinners([]);
            }}
          >
            {t("restart")}
          </button>

          <button onClick={() => navigate("/home")}>{t("home")}</button>
        </div>
      </div>
    );
  }

  // 로딩
  if (candidates.length === 0) {
    return <div>{t("loading")}</div>;
  }

  const left = candidates[currentIndex];
  const right = candidates[currentIndex + 1];

  if (!left || !right) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="worldcup-container">
      <div className="worldcup-top-overlay">
        <h1>
          {t("title")}{" "}
          {candidates.length === 2
            ? t("final")
            : t("round", { size: candidates.length })}{" "}
          {Math.floor(currentIndex / 2) + 1}/{candidates.length / 2}
        </h1>
      </div>

      <div className="worldcup-battle">
        <div className="worldcup-card" onClick={() => handleSelect(left)}>
          <img src={left.imageUrl} alt={left.title} />
          <div className="worldcup-overlay">
            <p>{left.title}</p>
          </div>
        </div>

        <div className="worldcup-vs">{t("vs")}</div>

        <div className="worldcup-card" onClick={() => handleSelect(right)}>
          <img src={right.imageUrl} alt={right.title} />
          <div className="worldcup-overlay">
            <p>{right.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
