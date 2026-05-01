import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AnimeSearch.css";
import { useTranslation } from "react-i18next";

export default function AnimeSearch() {
  const { t } = useTranslation("animesearch");
  const GENRE_DATA = [
    {
      title: "genre",
      items: [
        { id: "1", name: "action" },
        { id: "2", name: "adventure" },
        { id: "5", name: "avant_garde" },
        { id: "46", name: "award_winning" },
        { id: "4", name: "comedy" },
        { id: "8", name: "drama" },
        { id: "10", name: "fantasy" },
        { id: "47", name: "gourmet" },
        { id: "14", name: "horror" },
        { id: "7", name: "mystery" },
        { id: "22", name: "romance" },
        { id: "24", name: "sci_fi" },
        { id: "36", name: "slice_of_life" },
        { id: "30", name: "sports" },
        { id: "37", name: "supernatural" },
        { id: "41", name: "suspense" },
      ],
    },
    {
      title: "theme",
      items: [
        { id: "50", name: "adult_cast" },
        { id: "51", name: "anthropomorphic" },
        { id: "52", name: "cgdct" },
        { id: "53", name: "childcare" },
        { id: "54", name: "combat_sports" },
        { id: "81", name: "crossdressing" },
        { id: "55", name: "delinquents" },
        { id: "39", name: "detective" },
        { id: "56", name: "educational" },
        { id: "57", name: "gag_humor" },
        { id: "58", name: "gore" },
        { id: "35", name: "harem" },
        { id: "59", name: "high_stakes_game" },
        { id: "13", name: "historical" },
        { id: "60", name: "idol_female" },
        { id: "61", name: "idol_male" },
        { id: "62", name: "isekai" },
        { id: "63", name: "iyashikei" },
        { id: "64", name: "love_polygon" },
        { id: "74", name: "romantic_subtext" },
        { id: "65", name: "gender_bender" },
        { id: "66", name: "magical_girl" },
        { id: "17", name: "martial_arts" },
        { id: "18", name: "mecha" },
        { id: "67", name: "medical" },
        { id: "38", name: "military" },
        { id: "19", name: "music" },
        { id: "6", name: "mythology" },
        { id: "68", name: "organized_crime" },
        { id: "69", name: "otaku_culture" },
        { id: "20", name: "parody" },
        { id: "70", name: "performing_arts" },
        { id: "71", name: "pets" },
        { id: "40", name: "psychological" },
        { id: "3", name: "racing" },
        { id: "72", name: "reincarnation" },
        { id: "73", name: "reverse_harem" },
        { id: "21", name: "samurai" },
        { id: "23", name: "school" },
        { id: "75", name: "showbiz" },
        { id: "29", name: "space" },
        { id: "11", name: "strategy_game" },
        { id: "31", name: "super_power" },
        { id: "76", name: "survival" },
        { id: "77", name: "team_sports" },
        { id: "78", name: "time_travel" },
        { id: "82", name: "urban_fantasy" },
        { id: "32", name: "vampire" },
        { id: "79", name: "video_game" },
        { id: "83", name: "villainess" },
        { id: "80", name: "visual_arts" },
        { id: "48", name: "workplace" },
      ],
    },
    {
      title: "demographic",
      items: [
        { id: "43", name: "josei" },
        { id: "15", name: "kids" },
        { id: "42", name: "seinen" },
        { id: "27", name: "shounen" },
        { id: "25", name: "shoujo" },
      ],
    },
  ];

  const FLAT_GENRES = GENRE_DATA.flatMap((g) => g.items);

  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [rating, setRating] = useState("");
  const [minScore, setMinScore] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [genres, setGenres] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchGenre, setSearchGenre] = useState("");

  // 장르 체크 처리
  const handleGenreChange = (value) => {
    if (genres.includes(value)) {
      setGenres(genres.filter((g) => g !== value));
    } else {
      setGenres([...genres, value]);
    }
  };

  // 검색 버튼
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (keyword) params.append("keyword", keyword);
    if (type) params.append("type", type);
    if (status) params.append("status", status);
    if (rating) params.append("rating", rating);
    if (minScore) params.append("minScore", minScore);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    if (genres.length > 0) {
      genres.forEach((g) => params.append("genres", g));
    }

    // 결과 페이지로 이동
    navigate(`/result?${params.toString()}`);
  };

  return (
    <div className="anime-container">
      <h1>{t("title")}</h1>

      {/* 🔎 검색어 */}
      <input
        type="text"
        placeholder={t("search_placeholder")}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <hr />

      {/* 🎛 필터 */}
      <h3>{t("filters")}</h3>

      <div>
        <label>{t("type")}:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">{t("All")}</option>
          <option value="tv">TV</option>
          <option value="movie">Movie</option>
          <option value="ova">OVA</option>
          <option value="special">Special</option>
          <option value="ona">ONA</option>
          <option value="music">Music</option>
          <option value="cm">CM</option>
          <option value="pv">PV</option>
          <option value="tv_special">TV Special</option>
        </select>
      </div>

      <div>
        <label>{t("status")}:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">{t("All")}</option>
          <option value="airing">{t("airing")}</option>
          <option value="complete">{t("complete")}</option>
          <option value="upcoming">{t("upcoming")}</option>
        </select>
      </div>

      <div>
        <label>{t("rating")}:</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">{t("All")}</option>
          <option value="g">{t("g")}</option>
          <option value="pg">{t("pg")}</option>
          <option value="pg13">{t("pg13")}</option>
          <option value="r17">{t("r17")}</option>
          <option value="r">{t("r")}</option>
        </select>
      </div>

      <div>
        <label>{t("minScore")}:</label>
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={minScore}
          onChange={(e) => setMinScore(e.target.value)}
        />
      </div>

      <div>
        <label>{t("startDate")}:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div>
        <label>{t("endDate")}:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <hr />

      <h3>{t("genre")}</h3>

      <button className="genre-button" onClick={() => setIsModalOpen(true)}>
        {t("genre_select")} ({genres.length})
      </button>

      <div className="selected-genres">
        {genres.map((id) => {
          const g = FLAT_GENRES.find((v) => v.id === id);

          return (
            <span key={id} onClick={() => handleGenreChange(id)}>
              #{t(g?.name)} ❌
            </span>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="modal" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{t("genre_select")}</h2>

            {/* 🔍 검색 */}
            <input
              type="text"
              placeholder={t("search_genre")}
              value={searchGenre}
              onChange={(e) => setSearchGenre(e.target.value)}
            />

            {/* 선택된 장르 */}
            {genres.length > 0 && (
              <div className="selected-top">
                {genres.map((id) => {
                  const g = FLAT_GENRES.find((v) => v.id === id);
                  return (
                    <span key={id} onClick={() => handleGenreChange(id)}>
                      #{t(g?.name)} ❌
                    </span>
                  );
                })}
              </div>
            )}

            {/* 장르 리스트 */}
            <div className="genre-list">
              {GENRE_DATA.map((section) => (
                <div key={section.title}>
                  <h4>{t(section.title)}</h4>

                  <div className="genre-section">
                    {section.items
                      .filter((g) => t(g.name).includes(searchGenre))
                      .map((g) => (
                        <label key={g.id}>
                          <input
                            type="checkbox"
                            checked={genres.includes(g.id)}
                            onChange={() => handleGenreChange(g.id)}
                          />
                          {t(g.name)}
                        </label>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 버튼 */}
            <div className="modal-buttons">
              <button onClick={() => setGenres([])}>{t("reset")}</button>
              <button onClick={() => setIsModalOpen(false)}>{t("done")}</button>
            </div>
          </div>
        </div>
      )}

      <hr />

      <button onClick={handleSearch}>{t("search")}</button>
    </div>
  );
}
