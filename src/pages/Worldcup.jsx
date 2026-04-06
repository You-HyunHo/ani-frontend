import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Worldcup.css";

export default function Worldcup() {
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

  if (!isStarted) {
    return (
      <div className="start-overlay">
        <div className="start-box">
          <h2>애니메이션 월드컵</h2>

          <select
            value={roundSize}
            onChange={(e) => setRoundSize(Number(e.target.value))}
          >
            <option value={16}>16강</option>
            <option value={32}>32강</option>
            <option value={64}>64강</option>
            <option value={128}>128강</option>
            <option value={256}>256강</option>
          </select>

          <div className="start-buttons">
            <button onClick={() => setIsStarted(true)}>시작하기</button>

            <button onClick={() => navigate("/home")}>홈으로</button>
          </div>
        </div>
      </div>
    );
  }

  if (candidates.length === 1) {
    const winner = candidates[0];

    return (
      <div className="winner-container">
        <h1>🏆 우승!</h1>

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
            다시 하기
          </button>

          <button onClick={() => navigate("/home")}>홈으로</button>
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return <div>로딩중...</div>;
  }

  const left = candidates[currentIndex];
  const right = candidates[currentIndex + 1];

  if (!left || !right) {
    return <div>로딩중...</div>;
  }

  return (
    <div className="worldcup-container">
      <div className="worldcup-top-overlay">
        <h1>
          애니 이상형 월드컵{" "}
          {candidates.length === 2 ? "결승" : `${candidates.length}강`}{" "}
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

        <div className="worldcup-vs">VS</div>

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
